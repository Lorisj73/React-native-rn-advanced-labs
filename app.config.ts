export default {
  expo: {
    scheme: "rnadvancedlabs",
    name: "RN Advanced Labs",
    slug: "rn-advanced-labs",
    ios: {
      bundleIdentifier: "com.exemple.rnadvancedlabs",
      infoPlist: {
        NSCameraUsageDescription: "Cette application a besoin d'accéder à la caméra pour prendre des photos."
      }
    },
    android: {
      package: "com.exemple.rnadvancedlabs",
      permissions: ["CAMERA"]
    }
  }
}

