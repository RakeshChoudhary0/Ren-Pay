//
//  SceneDelegate.swift
//  RenPay
//
//  Created by Rakesh Choudhary on 29/09/26.
//

import UIKit
import React

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = (scene as? UIWindowScene) else { return }
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate,
          let factory = appDelegate.reactNativeFactory else { return }


    let window = UIWindow(windowScene: windowScene)

    // Automatically initializes rootViewController inside window
    factory.startReactNative(
      withModuleName: "RenPay",
      in: window,
      launchOptions: nil
    )
    

    self.window = window
    window.makeKeyAndVisible()
  }

  func sceneDidBecomeActive(_ scene: UIScene) {}
  func sceneWillResignActive(_ scene: UIScene) {}
  func sceneWillEnterForeground(_ scene: UIScene) {}
  func sceneDidEnterBackground(_ scene: UIScene) {}
}
