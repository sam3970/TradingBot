//Name       : TradingBot 
//Ver        : 0.2.6
//Creator    : sam3970
//Descriptor : 코인 가격 및 김프 알리미, 코인 자동거래 기능(추가 예정)

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {

    isGroupChat = true
    
    //현재 코인 가격
    function parsingEtc(etc)
    {
        etc = etc.split(",")[9]
        return etc = etc.split(":")[1]
        //etc = etc.split(".")[0]
    }

    //금일 총 거래대금
    function parsingTotal(total)
    {
        total = total.split(",")[18]
        total = total.split(":")[1]
        return total = total.split(".")[0]
    }

    //금일 최고가
    function parsingHighPrice(highp)
    {
        highp = highp.split(",")[7]
        return highp = highp.split(":")[1]
        //highp = highp.split(".")[0]
    }

    //금일 최저가
    function parsingLowPrice(lowp)
    {
        lowp = lowp.split(",")[8]
        return lowp = lowp.split(":")[1]
        //lowp = lowp.split(".")[0]
    }

    //금일 변동율
    function parsingChangeRate(changer)
    {
        changer = changer.split(",")[11]
        changer = changer.split(":")[1]
        return changer = changer.replace(/\"/g, "");
    }

    //금일 변동퍼센트
    function parsingChangePrice(changep)
    {
        changep = changep.split(",")[15]
        changep = changep.split(":")[1]
        return changep = changep.substr(0,5)
    }

    //천 단위 쉼표
    function priceToString(price) 
    {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    //김프 계산
    function exchangeKP(binance)
    {
      //기능 개선중
      if (binance.includes('Invalid') == true)
      {
        return "서비스 미지원"
      }
      else
      {
        var exchange = Utils.getHtmlFromWeb("https://earthquake.kr:23490/query/USDKRW")   
        exchange = exchange.split("[")[1]
        exchange = exchange.split(",")[0]

        binance = binance.split(",")[1]
        binance = binance.split(":")[1]
        binance = binance.split("}")[0]
        binance = binance.replace(/\"/g, "");

        var binkrw = exchange * binance
        var diffPrice = (((parsingEtc(etc) - binkrw) / binkrw) * 100).toFixed(2)
        return diffPrice
      }
    }
    
    //출력 함수
    function printResult(changer)
    {
        if (changer == "RISE")
        {
            return replier.reply(""+msg+"\n\n[현재가격]\n"+priceToString(parsingEtc(etc))+"원 (▲"+parsingChangePrice(changep)+"%) \n\n[김치프리미엄]\n"+exchangeKP(binance)+"% \n\n[금일최저가 ~ 금일최고가]\n"+priceToString(parsingLowPrice(lowp))+"원 ~ "+priceToString(parsingHighPrice(highp))+"원 \n\n[금일거래량]\n"+priceToString(parsingTotal(total))+"원 \n-by Upbit");
        }
        else if (changer == "FALL")
        {
            return replier.reply(""+msg+"\n\n[현재가격]\n"+priceToString(parsingEtc(etc))+"원 (▼"+parsingChangePrice(changep)+"%) \n\n[김치프리미엄]\n"+exchangeKP(binance)+"% \n\n[금일최저가 ~ 금일최고가]\n"+priceToString(parsingLowPrice(lowp))+"원 ~ "+priceToString(parsingHighPrice(highp))+"원 \n\n[금일거래량]\n"+priceToString(parsingTotal(total))+"원 \n-by Upbit");
        }
        else
        {
            return replier.reply(""+msg+"\n\n[현재가격]\n"+priceToString(parsingEtc(etc))+"원 (="+parsingChangePrice(changep)+"%) \n\n[김치프리미엄]\n"+exchangeKP(binance)+"% \n\n[금일최저가 ~ 금일최고가]\n"+priceToString(parsingLowPrice(lowp))+"원 ~ "+priceToString(parsingHighPrice(highp))+"원 \n\n[금일거래량]\n"+priceToString(parsingTotal(total))+"원 \n-by Upbit");
        }
    }

    if (room == "TradingBot" || room == "SangKyu" || room == "TradingBot2")
    {
      if (msg == "/한강" || msg == "/한강물" || msg == "/한강물온도" || msg == "/한강물 온도" || msg == "/한강 온도" || msg == "/한강온도")
      {
        var temperuture = Utils.getHtmlFromWeb("https://api.hangang.msub.kr/")
    
        temperuture = temperuture.split(",")[2]
        temperuture = temperuture.split(":")[1]
        //temperuture = temperuture.split(".")[0]
    
        temperuture = temperuture.replace(/\"/gi, "")
    
        replier.reply("현재 한강물 온도는 "+temperuture+"도 입니다. -by msub");    
      }
      if (msg == "/이클" || msg == "/이더리움클래식" || msg == "/etc") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ETCUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
      
      if (msg == "/비체인" || msg == "/vet") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=VETUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/하이브" || msg == "/hive") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=HIVEUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/리플" || msg == "/리또속" || msg == "/리태식" || msg == "/xrp") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=XRPUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/이오스" || msg == "/뽀삐" || msg == "/eos") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=EOSUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/비트토렌트" || msg == "/비토" || msg == "/btt") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BTTUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
      
      if (msg == "/칠리즈" || msg == "/칠리소스" || msg == "/chz") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=CHZUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/네오" || msg == "/neo") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=NEOUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/가스" || msg == "/심방구가스" || msg == "/gas") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=GASUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/비트코인" || msg == "/비코" || msg == "/대장" || msg == "/btc" || msg == "/비트") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BTCUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/온톨로지" || msg == "/온톨" || msg == "/ont") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ONTUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/이더리움" || msg == "/이더" || msg == "/eth") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ETHUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/에이다" || msg == "/아다" || msg == "/ada") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ADAUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/메디블록" || msg == "/메디" || msg == "/med") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MEDUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/던프로토콜" || msg == "/던 프로토콜" || msg == "/던" || msg == "/던프" || msg == "/dawn") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=DAWNUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/퀀텀" || msg == "/qtum") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=QTUMUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/체인링크" || msg == "/체링" || msg == "/채링" || msg == "/link") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=LINKUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/네오" || msg == "/neo") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=NEOUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/라이트코인" || msg == "/라코" || msg == "/라이트" || msg == "/ltc") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=LTCUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/웨이브" || msg == "/waves") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=WAVESUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스텔라루멘" || msg == "/스텔라" || msg == "/루멘" || msg == "/스텔라루멘스" || msg == "/xlm") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=XLMUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/폴카닷" || msg == "/꼴까닥" || msg == "/꼴가닥" || msg == "/dot") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=DOTUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/트론" || msg == "/trx") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=TRXUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/마로" || msg == "/maro") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MAROUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/헤데라해시그래프" || msg == "/헤데라" || msg == "/해시" || msg == "/해시그래프" || msg == "/hbar") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=HBARUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
      
      if (msg == "/스테이터스네트워크토큰" || msg == "/슨트" || msg == "/네트워크토큰" || msg == "/snt") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SNTUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/톤" || msg == "/ton") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=TONUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/크립토닷컴체인" || msg == "/크립토" || msg == "/cro") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=CROUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스톰엑스" || msg == "/stmx") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STMXUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/엠블" || msg == "/mvl") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MVLUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/모스코인" || msg == "/moc") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MOCUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/픽셀" || msg == "/pxl") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=PXLUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/픽셀" || msg == "/pxl") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ETCUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/샌드박스게이밍" || msg == "/샌드박스" || msg == "/샌박" || msg == "/sand") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sand")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sand")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sand")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sand")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sand")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sand")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SANDUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/비트코인캐시" || msg == "/비캐" || msg == "/bch") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BCHUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/비트코인캐시에이비씨" || msg == "/비트코인캐시에이비시" || msg == "/비트코인캐시abc" || msg == "/비캐abc" || msg == "/bcha") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BCHAUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/질리카" ||  msg == "/zil") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ZILUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/비트코인골드" || msg == "/비골" || msg == "/btg") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BTGUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스팀" || msg == "/steem") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STEEMUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스팀달러" || msg == "/sbd") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SBDUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/플로우" || msg == "/flow") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=FLOWUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/오미세고" || msg == "/omg") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=OMGUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/밀크" || msg == "/우유" || msg == "/야놀자" || msg == "/mlk") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MLKUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/시아코인" || msg == "/시아" || msg == "/sc") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SCUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스트라이크" || msg == "/스트" || msg == "/strk") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STRKUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/페이코인" || msg == "/페이" || msg == "/pci") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pci")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pci")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pci")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pci")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pci")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pci")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=PCIUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스토리지" || msg == "/storj") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STORJUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/엔도르" || msg == "/edr") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-edr")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-edr")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-edr")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-edr")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-edr")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-edr")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=EDRUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/도지코인" || msg == "/도지" || msg == "/멍멍" || msg == "/왈왈" || msg == "/머스크" || msg == "/doge") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=DOGEUSDT")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

    replier.markAsRead(TradingBot);
    }
}