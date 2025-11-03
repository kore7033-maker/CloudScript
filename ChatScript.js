// ChatScript.js
// =====================
// ✅ 간단한 글로벌 채팅 시스템 (최근 300개 메시지 유지)
// =====================

handlers.SendChatMessage = function (args, context) {
    var playerName = args.displayName;
    var message = args.message;

    if (!playerName || !message || message.length === 0) {
        return { error: "Invalid input" };
    }

    // 기존 채팅 불러오기
    var titleData = server.GetTitleData({ Keys: ["ChatMessages"] });
    var messages = titleData.Data && titleData.Data["ChatMessages"]
        ? titleData.Data["ChatMessages"].split("|")
        : [];

    // 메시지 추가
    var timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
    var fullMessage = "[" + playerName + "] " + timestamp + " : " + message;
    messages.push(fullMessage);

    // 최근 300개 유지
    if (messages.length > 300) {
        messages = messages.slice(messages.length - 300);
    }

    // TitleData 업데이트
    server.SetTitleData({
        Key: "ChatMessages",
        Value: messages.join("|")
    });

    // ✅ 반드시 객체 형태로 반환해야 Unity에서 파싱 가능
    return { success: true, messages: messages };
};


handlers.GetChatMessages = function (args, context) {
    var titleData = server.GetTitleData({ Keys: ["ChatMessages"] });
    var messages = titleData.Data && titleData.Data["ChatMessages"]
        ? titleData.Data["ChatMessages"].split("|")
        : [];

    if (messages.length > 300) {
        messages = messages.slice(messages.length - 300);
    }

    // ✅ Unity에서 파싱 가능한 형태
    return { messages: messages };
};
