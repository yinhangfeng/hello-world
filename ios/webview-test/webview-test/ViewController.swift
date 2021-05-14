//
//  ViewController.swift
//  webview-test
//
//  Created by yin hf on 2020/4/7.
//  Copyright © 2020 yin hf. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController, WKUIDelegate {
    
    var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
        initWKWebView()
//        initUIWebView()
    }
    
    func initWKWebView() {
        let webConfiguration = WKWebViewConfiguration()
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.frame = self.view.frame
        webView.uiDelegate = self
        webView.configuration.dataDetectorTypes = .all
        if #available(iOS 11.0, *) {
            // 通过 viewport-fit=cover 也可以达到一样效果，但有些网页下面会有空白，高度为顶部加底部 inset
            webView.scrollView.contentInsetAdjustmentBehavior = .never
        }
        self.view.addSubview(webView)

        let myRequest = URLRequest(url: URL(string:"https://pre-render.freshhema.com/app/base/pages/homepage.html?useCCBInfo=1")!)
//        let myRequest = URLRequest(url: URL(string:"https://www.taobao.com")!)
//        let myRequest = URLRequest(url: URL(string:"http://30.7.57.124:5000/ios-safe-area")!)
        webView.load(myRequest)
    }
    
    func initUIWebView() {
        let webView = UIWebView.init(frame:self.view.frame)
        self.view.addSubview(webView)

        let myRequest = URLRequest(url: URL(string:"https://pre-render.freshhema.com/app/base/pages/homepage.html?useCCBInfo=1")!)
        //        let myRequest = URLRequest(url: URL(string:"https://www.taobao.com")!)
        //        let myRequest = URLRequest(url: URL(string:"http://30.7.57.124:5000/ios-safe-area")!)
        webView.loadRequest(myRequest)
    }


}

