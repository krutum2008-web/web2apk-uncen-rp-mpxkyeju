package com.example.uncenrp;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;
import org.mozilla.geckoview.AllowOrDeny;
import org.mozilla.geckoview.GeckoResult;
import org.mozilla.geckoview.GeckoRuntime;
import org.mozilla.geckoview.GeckoRuntimeSettings;
import org.mozilla.geckoview.GeckoSession;
import org.mozilla.geckoview.GeckoSessionSettings;
import org.mozilla.geckoview.GeckoView;

public class MainActivity extends Activity {

    // GeckoRuntime must be a process-wide singleton
    private static GeckoRuntime sRuntime;
    private GeckoSession session;
    private boolean canGoBack = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setSoftInputMode(
            WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);

        // GeckoView uses Firefox engine — full Web Speech API / TTS support
        if (sRuntime == null) {
            sRuntime = GeckoRuntime.create(this,
                new GeckoRuntimeSettings.Builder()
                    .javaScriptEnabled(true)
                    .remoteDebuggingEnabled(false)
                    .build());
            // Install built-in AppBlocker extension (network + cosmetic blocking + custom JS)
            sRuntime.getWebExtensionController()
                .installBuiltIn("resource://android/assets/extension/");
        }

        session = new GeckoSession(
            new GeckoSessionSettings.Builder()
                .usePrivateMode(false)
                .suspendMediaWhenInactive(false)
                .viewportMode(GeckoSessionSettings.VIEWPORT_MODE_MOBILE)
                .userAgentMode(GeckoSessionSettings.USER_AGENT_MODE_MOBILE)
                .build()
        );

        // Back navigation tracking + external link interception
        session.setNavigationDelegate(new GeckoSession.NavigationDelegate() {
            @Override
            public void onCanGoBack(GeckoSession s, boolean value) {
                canGoBack = value;
            }

            @Override
            public GeckoResult<AllowOrDeny> onLoadRequest(GeckoSession s,
                    GeckoSession.NavigationDelegate.LoadRequest req) {
                if (req.uri.startsWith("intent:") || req.uri.startsWith("market:")) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(req.uri)));
                    } catch (ActivityNotFoundException e) { /* ignore */ }
                    return GeckoResult.fromValue(AllowOrDeny.DENY);
                }
                return null;
            }
        });

        GeckoView geckoView = new GeckoView(this);
        setContentView(geckoView);
        session.open(sRuntime);
        geckoView.setSession(session);
        session.loadUri("https://link.prod.sekai.chat/3HIL4M");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (canGoBack) {
                session.goBack(false);
            } else {
                finish();
            }
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (session != null) session.close();
    }
}
