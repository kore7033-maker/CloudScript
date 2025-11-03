handlers.SendChatMessage = function(args, context) {
    var playerName = args.displayName;
    var message = args.message;

    if(!playerName || !message || message.length === 0) {
        return { error: "Invalid input" };
    }

    // 기존 채팅 불러오기
    var titleData = server.GetTitleData({ Keys: ["ChatMessages"] });
    var messages = titleData.Data && titleData.Data["ChatMessages"] ? titleData.Data["ChatMessages"].split("|") : [];

    // 메시지 추가
    var timestamp = new Date().toISOString();
    var fullMessage = `[${playerName}] ${timestamp}: ${message}`;
    messages.push(fullMessage);

    // 최근 300개만 유지
    if(messages.length > 300) {
        messages = messages.slice(messages.length - 300);
    }

    // TitleData 갱신
    server.SetTitleData({ Key: "ChatMessages", Value: messages.join("|") });

    return { success: true, messages: messages };
};

handlers.GetChatMessages = function(args, context) {
    var titleData = server.GetTitleData({ Keys: ["ChatMessages"] });
    var messages = titleData.Data && titleData.Data["ChatMessages"] ? titleData.Data["ChatMessages"].split("|") : [];
    
    if(messages.length > 300) {
        messages = messages.slice(messages.length - 300);
    }

    return { messages: messages };
};
