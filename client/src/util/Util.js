export const copyLink = async () => {
  try {
    const result = await navigator.permissions.query({
      name: "clipboard-write",
    });
    if (result.state === "granted" || result.state === "prompt") {
      const link = window.location.href;
      const arrayLink = link.split("/");
      const id = arrayLink[arrayLink.length - 1];
      await navigator.clipboard.writeText(id);
      return {
        success: true,
        msg: "Room Id copied.",
      };
    } else {
      return {
        success: false,
        msg: "Permission Error in copying room id.",
      };
    }
  } catch (e) {
    return {
      success: false,
      msg: "Error in copying room id.",
    };
  }
};
