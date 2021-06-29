function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) 
{
    isGroupChat = true
    
    //현재 코인 가격
    function parsingEtc(etc)
    {
        etc = etc.split(",")[9]
        etc = etc.split(":")[1]
        return Math.round(etc * 100) / 100
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
        highp = highp.split(":")[1]
        return Math.round(highp * 100) / 100
    }

    //금일 최저가
    function parsingLowPrice(lowp)
    {
        lowp = lowp.split(",")[8]
        lowp = lowp.split(":")[1]
        return Math.round(lowp * 100) / 100
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
        var changeRatio = (changep * 100).toFixed(2)
        return changeRatio
    }

    //Rsi Candle 지표 계산
    function Rsi(candle)
    {
      let j = 11 //(분봉시) 6
      let ascend_sum = 0
      let descend_sum = 0

      let rsi_asum = 0
      let rsi_dsum = 0

      let rsi_aavg = 0
      let rsi_davg = 0
      
      let rsi_result = 0

      var candle_Num = new Array()
      
      for (let i=0; i<14 ;i++)
      {
        candle_Num[i] = candle.split(",")[j].split(":")[1]
        
        if (candle_Num[i] == "null")
        {
          candle_Num[i] = 20 //RSI k-means 학습 결과 이평선 평균값은 20을 가지는 것으로 확인
        }
        
        if (candle_Num[i] >= 0)
        {
          ascend_sum = parseFloat(candle_Num[i]) + ascend_sum
        }

        else
        {
          descend_sum = parseFloat(candle_Num[i]) + descend_sum
        }
        j = j + 13 //(분봉시) 11
      }

      rsi_asum = Math.round(ascend_sum * 100) / 100
      rsi_dsum = Math.round(descend_sum * 100) / 100

      rsi_aavg = rsi_asum / 14
      rsi_davg = Math.abs(rsi_dsum) / 14

      //by Formula Bitcoin Trading Labs
      rsi_result = (100 * rsi_aavg / (rsi_aavg + rsi_davg)).toFixed(2)
      return rsi_result
    }

    //천 단위 쉼표
    function priceToString(price) 
    {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    //김프 계산
    function exchangeKP(binance)
    {
      //null 처리 기능(Binance에 없는 data 일 경우)
      if (binance == null)
      {
        return "(미지원)NaN"
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
            return replier.reply(""+msg+"\n\n[현재가격]\n"+priceToString(parsingEtc(etc))+"원 (▲"+parsingChangePrice(changep)+"%) \n\n[김치프리미엄]\n"+exchangeKP(binance)+"% \n\n[금일최저가 ~ 금일최고가]\n"+priceToString(parsingLowPrice(lowp))+"원 ~ "+priceToString(parsingHighPrice(highp))+"원 \n\n[RSI Value]\n"+Rsi(candle)+" \n\n[금일거래량]\n"+priceToString(parsingTotal(total))+"원 \n-by Upbit");
        }
        else if (changer == "FALL")
        {
            return replier.reply(""+msg+"\n\n[현재가격]\n"+priceToString(parsingEtc(etc))+"원 (▼"+parsingChangePrice(changep)+"%) \n\n[김치프리미엄]\n"+exchangeKP(binance)+"% \n\n[금일최저가 ~ 금일최고가]\n"+priceToString(parsingLowPrice(lowp))+"원 ~ "+priceToString(parsingHighPrice(highp))+"원 \n\n[RSI Value]\n"+Rsi(candle)+" \n\n[금일거래량]\n"+priceToString(parsingTotal(total))+"원 \n-by Upbit");
        }
        else
        {
            return replier.reply(""+msg+"\n\n[현재가격]\n"+priceToString(parsingEtc(etc))+"원 (="+parsingChangePrice(changep)+"%) \n\n[김치프리미엄]\n"+exchangeKP(binance)+"% \n\n[금일최저가 ~ 금일최고가]\n"+priceToString(parsingLowPrice(lowp))+"원 ~ "+priceToString(parsingHighPrice(highp))+"원 \n\n[RSI Value]\n"+Rsi(candle)+" \n\n[금일거래량]\n"+priceToString(parsingTotal(total))+"원 \n-by Upbit");
        }
    }

    if (room == "TradingBot" || room == "SangKyu" || room == "TradingBot2" || room == "TradingBot3" || room == "TradingBot4" || room == "TradingBot5" || room == "TradingBot6")
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
      if (msg == "/이클" || msg == "/이더리움클래식" || msg == "/etc" || msg == "/ETC") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ETCUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-etc&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
      
      if (msg == "/비체인" || msg == "/vet" || msg == "/VET") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=VETUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-vet&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/하이브" || msg == "/hive" || msg == "/HIVE") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=HIVEUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-hive&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/리플" || msg == "/리또속" || msg == "/리태식" || msg == "/xrp" || msg == "/XRP") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=XRPUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-xrp&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/이오스" || msg == "/뽀삐" || msg == "/eos" || msg == "/EOS") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=EOSUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-eos&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/비트토렌트" || msg == "/비토" || msg == "/btt" || msg == "/BTT") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BTTUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-btt&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
      
      if (msg == "/칠리즈" || msg == "/칠리소스" || msg == "/chz" || msg == "/CHZ") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=CHZUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-chz&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/쎄타토큰" || msg == "/theta" || msg == "/THETA") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-theta")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-theta")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-theta")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-theta")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-theta")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-theta")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=THETAUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-theta&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/가스" || msg == "/심방구가스" || msg == "/gas" || msg == "/GAS")
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=GASUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-gas&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/비트코인" || msg == "/비코" || msg == "/대장" || msg == "/btc" || msg == "/비트" || msg == "/BTC") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BTCUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-btc&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/온톨로지" || msg == "/온톨" || msg == "/ont" || msg == "/ONT") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ONTUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-ont&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/이더리움" || msg == "/이더" || msg == "/eth" || msg == "/ETH") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ETHUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-eth&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/에이다" || msg == "/아다" || msg == "/ada" || msg == "/ADA") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ADAUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-ada&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/메디블록" || msg == "/메디" || msg == "/med" || msg == "/MED") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MEDUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-med&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/던프로토콜" || msg == "/던 프로토콜" || msg == "/던" || msg == "/던프" || msg == "/dawn" || msg == "/DAWN") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=DAWNUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-dawn&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/퀀텀" || msg == "/qtum" || msg == "/QTUM") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=QTUMUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-qtum&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/체인링크" || msg == "/체링" || msg == "/채링" || msg == "/link" || msg == "/LINK") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=LINKUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-link&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/네오" || msg == "/neo" || msg == "/NEO") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=NEOUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-neo&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/라이트코인" || msg == "/라코" || msg == "/라이트" || msg == "/ltc" || msg == "/LTC") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=LTCUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-ltc&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/웨이브" || msg == "/waves" || msg == "/WAVES") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=WAVESUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-waves&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스텔라루멘" || msg == "/스텔라" || msg == "/루멘" || msg == "/스텔라루멘스" || msg == "/xlm" || msg == "/XLM") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=XLMUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-xlm&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/폴카닷" || msg == "/꼴까닥" || msg == "/폴카" || msg == "/dot" || msg == "/DOT") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=DOTUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-dot&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/트론" || msg == "/trx" || msg == "/TRX") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=TRXUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-trx&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      /*if (msg == "/마로" || msg == "/maro" || msg == "/MARO") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MAROUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-maro&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }*/

      if (msg == "/헤데라해시그래프" || msg == "/헤데라" || msg == "/해시" || msg == "/해시그래프" || msg == "/hbar" || msg == "/HBAR") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=HBARUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-hbar&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
      
      if (msg == "/스테이터스네트워크토큰" || msg == "/슨트" || msg == "/네트워크토큰" || msg == "/snt" || msg == "/SNT") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SNTUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-snt&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/톤" || msg == "/ton" || msg == "/TON") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=TONUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-ton&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/크립토닷컴체인" || msg == "/크립토" || msg == "/cro" || msg == "/CRO") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=CROUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-cro&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스톰엑스" || msg == "/stmx" || msg == "/STMX") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STMXUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-stmx&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }
    
      if (msg == "/엠블" || msg == "/mvl" || msg == "/MVL") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MVLUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-mvl&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/모스코인" || msg == "/moc" || msg == "/MOC") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MOCUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-moc&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/픽셀" || msg == "/pxl" || msg == "/PXL") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=PXLUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-pxl&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/파워렛저" || msg == "/powr" || msg == "/POWR") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-powr")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-powr")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-powr")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-powr")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-powr")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-powr")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=POWRUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-powr&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

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
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-sand&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/비트코인캐시" || msg == "/비캐" || msg == "/bch" || msg == "/BCH") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BCHUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-bch&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/비트코인캐시에이비씨" || msg == "/비트코인캐시에이비시" || msg == "/비트코인캐시abc" || msg == "/비캐abc" || msg == "/bcha" || msg == "/BCHA") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BCHAUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-bcha&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/질리카" ||  msg == "/zil" ||  msg == "/ZIL") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ZILUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-zil&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/비트코인골드" || msg == "/비골" || msg == "/btg" || msg == "/BTG") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BTGUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-btg&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스팀" || msg == "/steem" || msg == "/STEEM") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STEEMUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-steem&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스팀달러" || msg == "/sbd" || msg == "/SBD") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SBDUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-sbd&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/플로우" || msg == "/flow" || msg == "/FLOW") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=FLOWUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-flow&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/오미세고" || msg == "/omg" || msg == "/OMG") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=OMGUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-omg&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/밀크" || msg == "/우유" || msg == "/야놀자" || msg == "/mlk" || msg == "/MLK") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MLKUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-mlk&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/시아코인" || msg == "/시아" || msg == "/sc" || msg == "/SC") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SCUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-sc&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스트라이크" || msg == "/스트" || msg == "/strk" || msg == "/STRK") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STRKUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-strk&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/메타디움" || msg == "/메타" || msg == "/meta" || msg == "/META") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-meta")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-meta")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-meta")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-meta")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-meta")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-meta")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=METAUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-meta&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스토리지" || msg == "/storj" || msg == "/STORJ") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STORJUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-storj&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

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
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-edr&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/도지코인" || msg == "/도지" || msg == "/멍멍" || msg == "/왈왈" || msg == "/머스크" || msg == "/doge" || msg == "/DOGE") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=DOGEUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-doge&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/쎄타퓨엘" || msg == "/tfuel" || msg == "/TFUEL") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tfuel")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tfuel")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tfuel")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tfuel")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tfuel")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tfuel")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=TFUELUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-tfuel&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/스트라티스" || msg == "/strax" || msg == "/STRAX") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strax")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strax")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strax")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strax")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strax")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strax")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STRAXUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-strax&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/아하토큰" || msg == "/아하" || msg == "/aht" || msg == "/AHT") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aht")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aht")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aht")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aht")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aht")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aht")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=AHTUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-aht&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/디센트럴랜드" || msg == "/디센" || msg == "/mana" || msg == "/MANA") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mana")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mana")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mana")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mana")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mana")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mana")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MANAUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-mana&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/아인스타이늄" || msg == "/아인" || msg == "/emc2" || msg == "/EMC2") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-emc2")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-emc2")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-emc2")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-emc2")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-emc2")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-emc2")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=EMC2USDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-emc2&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/베이직어텐션토큰" || msg == "/베이직" || msg == "/bat" || msg == "/BAT") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bat")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bat")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bat")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bat")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bat")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bat")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BATUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-bat2&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

      if (msg == "/보라"  || msg == "/bora" || msg == "/BORA") 
      {
        var etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bora")
        var total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bora")
        var highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bora")
        var lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bora")
        var changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bora")
        var changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bora")
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BORAUSDT")
        var candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-bora&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi(candle)

        printResult(parsingChangeRate(changer))

        exchangeKP(binance)
      }

    replier.markAsRead(TradingBot);
    }
}