function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {

    if (msg == "/한강" || msg == "/한강물" || msg == "/한강물온도" || msg == "/한강물 온도" || msg == "/한강 온도" || msg == "/한강온도")
    {
        var temperuture = Utils.getHtmlFromWeb("https://api.hangang.msub.kr/")

        temperuture = temperuture.split(",")[2]
        temperuture = temperuture.split(":")[1]
        //temperuture = temperuture.split(".")[0]

        temperuture = temperuture.replace(/\"/gi, "")

        replier.reply("현재 한강물 온도는 "+temperuture+"도 입니다. -by msub");    
    }
    
    if (msg.includes("/코로나") || msg.includes("/우한폐렴") || msg.includes("/covid") || msg.includes("/COVID"))
    {
        var covid_confirmation = Utils.getHtmlFromWeb("https://capi.msub.kr/")
        var covid_dead = Utils.getHtmlFromWeb("https://capi.msub.kr/")
        var covid_time = Utils.getHtmlFromWeb("https://capi.msub.kr/")
        
        covid_time = covid_time.split(",")[2]
        covid_time = covid_time.split(":")[1]
        
        covid_confirmation = covid_confirmation.split("}")[1]
        covid_confirmation = covid_confirmation.split(":")[2]
        covid_confirmation = covid_confirmation.split("dead")[0]
    
        covid_dead = covid_dead.split("}")[1]
        covid_dead = covid_dead.split(":")[3]

        
        covid_time = covid_time.replace(/\"/gi, "")
        covid_confirmation = covid_confirmation.replace(/\"/gi, "")
        covid_confirmation = covid_confirmation.replace(/,/g,"")
        covid_dead = covid_dead.replace(/\"/gi, "")

        replier.reply("금일 "+covid_time+" 확진자는 "+covid_confirmation+"명 사망자는 "+covid_dead+"명 입니다.\n-by msub");
    }
}