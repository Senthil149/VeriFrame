// ==========================================
// VERIFRAME BROWSER NOTIFICATION
// ==========================================

export const sendAnalysisNotification = async ({
  fileName,
  prediction,
  confidence,
}) => {

  console.log(
    "🔔 Starting VeriFrame notification..."
  );


  // ==========================================
  // CHECK BROWSER SUPPORT
  // ==========================================

  if (!("Notification" in window)) {

    console.error(
      "❌ This browser does not support notifications."
    );

    return false;
  }


  console.log(
    "🔔 Current notification permission:",
    Notification.permission
  );


  // ==========================================
  // REQUEST PERMISSION
  // ==========================================

  if (
    Notification.permission ===
    "default"
  ) {

    console.log(
      "🔔 Requesting notification permission..."
    );


    try {

      const permission =
        await Notification.requestPermission();


      console.log(
        "🔔 Permission result:",
        permission
      );


      if (
        permission !==
        "granted"
      ) {

        console.error(
          "❌ Notification permission was not granted."
        );

        return false;
      }

    } catch (error) {

      console.error(
        "❌ Permission request failed:",
        error
      );

      return false;
    }

  }


  // ==========================================
  // CHECK AGAIN
  // ==========================================

  if (
    Notification.permission !==
    "granted"
  ) {

    console.error(
      "❌ Notifications are blocked."
    );

    console.error(
      "Permission:",
      Notification.permission
    );

    return false;
  }


  // ==========================================
  // PREPARE DATA
  // ==========================================

  const result =
    String(
      prediction || "UNKNOWN"
    ).toUpperCase();


  const confidenceValue =
    Number(
      confidence || 0
    );


  const formattedConfidence =
    confidenceValue.toFixed(2);


  const safeFileName =
    fileName ||
    "Image";


  // ==========================================
  // CREATE MESSAGE
  // ==========================================

  let title = "";
  let body = "";


  if (
    result === "FAKE"
  ) {

    title =
      "🚨 VeriFrame - Deepfake Detected";


    body =
      `${safeFileName} was classified as FAKE with ${formattedConfidence}% confidence.`;

  }


  else if (
    result === "REAL"
  ) {

    title =
      "✅ VeriFrame - Authentic Image";


    body =
      `${safeFileName} was classified as REAL with ${formattedConfidence}% confidence.`;

  }


  else {

    title =
      "🤖 VeriFrame - Analysis Complete";


    body =
      `${safeFileName} has been analyzed successfully.`;

  }


  console.log(
    "🔔 Notification title:",
    title
  );


  console.log(
    "🔔 Notification body:",
    body
  );


  // ==========================================
  // CREATE NOTIFICATION
  // ==========================================

  try {

    const notification =
      new Notification(
        title,
        {
          body:
            body,

          tag:
            `veriframe-${Date.now()}`,

          requireInteraction:
            false,
        }
      );


    console.log(
      "✅ NOTIFICATION CREATED SUCCESSFULLY"
    );


    // ==========================================
    // NOTIFICATION CLICK
    // ==========================================

    notification.onclick =
      () => {

        window.focus();

        window.location.href =
          "/history";

        notification.close();

      };


    return true;

  } catch (error) {

    console.error(
      "❌ Notification creation failed:",
      error
    );

    return false;

  }

};