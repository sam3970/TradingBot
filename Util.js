function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {

    if (msg.includes("/한강"))
    {
        let temperuture = Utils.getHtmlFromWeb("https://api.hangang.msub.kr/")

        temperuture = temperuture.split(",")[2]
        temperuture = temperuture.split(":")[1]
        //temperuture = temperuture.split(".")[0]

        temperuture = temperuture.replace(/\"/gi, "")

        replier.reply("현재 한강물 온도는 "+temperuture+"도 입니다. -by msub");    
    }
    
    if (msg.includes("/코로나") || msg.includes("/우한폐렴") || msg.includes("/covid") || msg.includes("/COVID"))
    {
        let covid_confirmation = Utils.getHtmlFromWeb("https://capi.msub.kr/")
        let covid_dead = Utils.getHtmlFromWeb("https://capi.msub.kr/")
        let covid_time = Utils.getHtmlFromWeb("https://capi.msub.kr/")
        
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

        replier.reply("금일 "+covid_time+" 확진자는 "+covid_confirmation+"명 사망자는 "+covid_dead+"명 입니다.\n-by 질병관리청");
    }

    if (msg.includes("/탐욕") || msg.includes("/공포"))
    {
        let fear = Utils.getHtmlFromWeb("https://api.btctools.io/api/fear-greed")
        
        let fear_value = fear.split(":")[3].split(",")[0]

        let result_Disply
        
        if (fear_value > 0 && fear_value < 25)
        {
          result_Display = "극한 공포"          
        }
        else if (fear_value >= 25 && fear_value < 50)
        {
          result_Display = "공포"          
        }
        else if (fear_value >= 50 && fear_value < 75)
        {
          result_Display = "탐욕"          
        }
        else if (fear_value >= 75 && fear_value <= 100)
        {
          result_Display = "극단적 탐욕"          
        }
        else
        {
          result_Display = "잘못된 값이 출력되었습니다. 관리자에게 문의바랍니다."          
        }

        replier.reply("탐욕 수치 : "+fear_value+"\n탐욕 지수 : "+result_Display+"\n-by btctools");
    }
}