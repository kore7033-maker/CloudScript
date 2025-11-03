/*
=====================================================
 PlayFab CloudScript - Global Chat System
 Author: ChatGPT (정리 버전)
 Description:
   - 모든 플레이어가 공유하는 글로벌 채팅 시스템
   - 최근 300개 메시지만 유지
   - 서버에서 안전하게 TitleData를 관리
=====================================================
*/

handlers.SendChatMessage = function (args, context) {
    var playerName = args.displayName;
    var message = args.message;

    if (!playerName || !message || message.length === 0) {
        return { error: "Invalid input" };
    }

    // 기존 채팅 불러오기
    var titleData = server.GetTitleData({ Keys: ["ChatMessages"] });
    var messages = [];

    if (titleData.Data && titleData.Data["ChatMessages"]) {
        messages = titleData.Data["ChatMessages"].split("|");
    }

    // 새 메시지 추가 (날짜 포맷: yyyy-MM-dd HH:mm:ss)
    var timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
    var newMessage = "[" + playerName + "] " + timestamp + " : " + message;
    messages.push(newMessage);

    // 300개 제한
    if (messages.length > 300) {
        messages = messages.slice(messages.length - 300);
    }

    // TitleData 갱신
    server.SetTitleData({
        Key: "ChatMessages",
        Value: messages.join("|")
    });

    return { success: true, messages: messages };
};


handlers.GetChatMessages = function (args, context) {
    var titleData = server.GetTitleData({ Keys: ["ChatMessages"] });
    var messages = [];

    if (titleData.Data && titleData.Data["ChatMessages"]) {
        messages = titleData.Data["ChatMessages"].split("|");
    }

    // 300개 제한
    if (messages.length > 300) {
        messages = messages.slice(messages.length - 300);
    }

    // 반드시 객체 형태로 반환해야 Unity에서 파싱 가능
    return { messages: messages };
};

