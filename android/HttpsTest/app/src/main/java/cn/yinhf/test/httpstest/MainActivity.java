package cn.yinhf.test.httpstest;

import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Collections;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.CipherSuite;
import okhttp3.ConnectionSpec;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.TlsVersion;
import okio.Okio;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";

//    static {
//        HttpsURLConnection.setDefaultSSLSocketFactory(new NoSSLv3Factory());
//    }

//    static {
//        SSLContext sslcontext = null;
//        try {
//            sslcontext = SSLContext.getInstance("TLSv1");
//            sslcontext.init(null,
//                    null,
//                    null);
//            SSLSocketFactory NoSSLv3Factory = new NoSSLv3SocketFactory(sslcontext.getSocketFactory());
//
//            HttpsURLConnection.setDefaultSSLSocketFactory(NoSSLv3Factory);
//        } catch(NoSuchAlgorithmException e) {
//            e.printStackTrace();
//        } catch(KeyManagementException e) {
//            e.printStackTrace();
//        }
//    }

    //http://blog.csdn.net/xcrow/article/details/37876165
//    static {
//        System.setProperty ("jsse.enableSNIExtension", "false");
//    }
    private OkHttpClient okHttpClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 查看站点支持的ConnectionSpec:  nmap -sV --script ssl-enum-ciphers example.com

        // SSLHandshakeException: Connection closed by peer  https://github.com/square/okhttp/issues/3188
        ConnectionSpec spec = new ConnectionSpec.Builder(ConnectionSpec.MODERN_TLS)
//                .supportsTlsExtensions(false)
                .cipherSuites(
//                        CipherSuite.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,
//                        CipherSuite.TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
//                        CipherSuite.TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,
//                        CipherSuite.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
//                        CipherSuite.TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,
//                        CipherSuite.TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,
//
//                        // Note that the following cipher suites are all on HTTP/2's bad cipher suites list. We'll
//                        // continue to include them until better suites are commonly available. For example, none
//                        // of the better cipher suites listed above shipped with Android 4.4 or Java 7.
//                        CipherSuite.TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,
//                        CipherSuite.TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,
//                        CipherSuite.TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,
//                        CipherSuite.TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,
//                        CipherSuite.TLS_RSA_WITH_AES_128_GCM_SHA256,
//                        CipherSuite.TLS_RSA_WITH_AES_256_GCM_SHA384,
//                        CipherSuite.TLS_RSA_WITH_AES_128_CBC_SHA,
//                        CipherSuite.TLS_RSA_WITH_AES_256_CBC_SHA,
//                        CipherSuite.TLS_RSA_WITH_3DES_EDE_CBC_SHA,

                        //相对于MODERN_TLS增加(不安全)
                        CipherSuite.TLS_RSA_WITH_RC4_128_MD5,
                        CipherSuite.TLS_RSA_WITH_RC4_128_SHA,
                        CipherSuite.TLS_RSA_WITH_3DES_EDE_CBC_SHA,
                        CipherSuite.TLS_RSA_WITH_DES_CBC_SHA,

//                        CipherSuite.TLS_RSA_EXPORT1024_WITH_RC4_56_SHA,
//                        CipherSuite.TLS_RSA_EXPORT1024_WITH_DES_CBC_SHA,
                        CipherSuite.TLS_RSA_EXPORT_WITH_RC4_40_MD5
//                        CipherSuite.TLS_RSA_EXPORT_WITH_RC2_CBC_40_MD5
                )
//                .tlsVersions(TlsVersion.TLS_1_0, TlsVersion.SSL_3_0)
                .build();

        okHttpClient = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(20, TimeUnit.SECONDS)

                .connectionSpecs(Arrays.asList(spec, ConnectionSpec.CLEARTEXT))
                .build();
    }

    //String url = "https://passport.alibaba.com/mini_login.htm";
    // String url = "http://www.baidu.com/";
//    String url = "https://www.1688.com/";
    //String url = "https://www.taobao.com/";
    String url = "https://img1.qikan.com/qkimages/sjpl/sjpl201712-l.jpg";

    public void test1(View v) {
        final Request request = new Request.Builder().url(url).build();
        okHttpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e(TAG, "onFailure() ", e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.i(TAG, "onResponse headers:" + response.headers());
            }
        });

//        new AsyncTask<Void, Void, Void>() {
//
//            @Override
//            protected Void doInBackground(Void[] params) {
//                try {
//                    Response response = okHttpClient.newCall(request).execute();
//                    Log.i(TAG, "doInBackground: response headers:" + response.headers());
//                } catch(IOException e) {
//                    e.printStackTrace();
//                }
//
//                return null;
//            }
//        }.execute();
    }

    public void test2(View v) {
        new AsyncTask<Void, Void, Void>() {

            @Override
            protected Void doInBackground(Void[] params) {
                try {
                    URLConnection connection = new URL(url).openConnection();
                    connection.connect();
                    Log.i(TAG, "doInBackground: connected headers:" + connection.getHeaderFields());
                    String s = new String(Okio.buffer(Okio.source(connection.getInputStream())).readByteArray());
                    Log.i(TAG, "doInBackground: content " + s);
                } catch(MalformedURLException e) {
                    e.printStackTrace();
                } catch(IOException e) {
                    e.printStackTrace();
                }

                return null;
            }
        }.execute();
    }

    public void test3(View v) {

    }
}
