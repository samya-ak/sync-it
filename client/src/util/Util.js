export const copyLink = async () => {
  try {
    const result = await navigator.permissions.query({
      name: "clipboard-write",
    });
    if (result.state === "granted" || result.state === "prompt") {
      const link = window.location.href;
      await navigator.clipboard.writeText(link);
      return {
        success: true,
        msg: "Room link copied.",
      };
    } else {
      return {
        success: false,
        msg: "Permission Error in copying link.",
      };
    }
  } catch (e) {
    return {
      success: false,
      msg: "Error in copying link.",
    };
  }
};
