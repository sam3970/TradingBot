function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) 
{
    isGroupChat = true
    
    //현재 코인 가격
    function parsingEtc(etc)
    {
        etc = etc.split(",")[9]
        etc = etc.split(":")[1]

        if (msg == "/btt" || msg == "/비트토렌트" || msg == "/xec")
        {
          return parseFloat(etc).toFixed(4)
        }
        else
        {
          return Math.round(etc * 100) / 100
        }   
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
        
        if (msg == "/btt" || msg == "/비트토렌트" || msg == "/xec")
        {
          return parseFloat(highp).toFixed(4)
        }
        else
        {
          return Math.round(highp * 100) / 100
        }  
    }

    //금일 최저가
    function parsingLowPrice(lowp)
    {
        lowp = lowp.split(",")[8]
        lowp = lowp.split(":")[1]
                
        if (msg == "/btt" || msg == "/비트토렌트" || msg == "/xec")
        {
          return parseFloat(lowp).toFixed(4)
        }
        else
        {
          return Math.round(lowp * 100) / 100
        }  
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
        let changeRatio = (changep * 100).toFixed(2)
        return changeRatio
    }

    //Rsi Candle 지표 계산
    function Rsi(candle)
    {
      let j = 11
      let ascend_sum = 0
      let descend_sum = 0

      let rsi_asum = 0
      let rsi_dsum = 0

      let rsi_aavg = 0
      let rsi_davg = 0
      
      let rsi_result = 0

      let candle_Num = new Array()
      
      for (let i=0; i<14 ;i++)
      {
        candle_Num[i] = candle.split(",")[j].split(":")[1]
        
        if (candle_Num[i] == "null")
        {
          candle_Num[i] = 20
        }

        if (candle_Num[i] >= 0)
        {
          ascend_sum = parseFloat(candle_Num[i]) + ascend_sum
        }
        else
        {
          descend_sum = parseFloat(candle_Num[i]) + descend_sum
        }
        j = j + 13
      }

      rsi_asum = Math.round(ascend_sum * 100) / 100
      rsi_dsum = Math.round(descend_sum * 100) / 100

      rsi_aavg = rsi_asum / 14
      rsi_davg = Math.abs(rsi_dsum) / 14

      //by Formula Bitcoin Trading Labs
      rsi_result = (100 * rsi_aavg / (rsi_aavg + rsi_davg)).toFixed(2)
      return rsi_result
    }

    //Rsi Candle 지표 계산(신규코인 전용)
    function Rsi_1h(candle)
    {
      let j = 6
      let ascend_sum = 0
      let descend_sum = 0

      let rsi_asum = 0
      let rsi_dsum = 0

      let rsi_aavg = 0
      let rsi_davg = 0
      
      let rsi_result = 0

      let candle_Num = new Array()
      let candle_Num1 = new Array()
      let candle_Num2 = new Array()
      
      for (let i=0; i<14 ;i++)
      {
        if ( i != 13 )
        {
          candle_Num1[i] = candle.split(",")[j].split(":")[1]
          candle_Num2[i] = candle.split(",")[j+11].split(":")[1]
          candle_Num[i] = candle_Num1[i] - candle_Num2[i]
        }
        else
        {
          candle_Num[i] = candle.split(",")[j].split(":")[1]
        }

        if (candle_Num[i] == "null")
        {
          candle_Num[i] = 20
        }

        if (candle_Num[i] >= 0)
        {
          ascend_sum = parseFloat(candle_Num[i]) + ascend_sum
        }
        else
        {
          descend_sum = parseFloat(candle_Num[i]) + descend_sum
        }
        j = j + 11
      }

      rsi_asum = Math.round(ascend_sum * 100) / 100
      rsi_dsum = Math.round(descend_sum * 100) / 100

      rsi_aavg = rsi_asum / 14
      rsi_davg = Math.abs(rsi_dsum) / 14

      //by Formula Bitcoin Trading Labs
      rsi_1h_result = (100 * rsi_aavg / (rsi_aavg + rsi_davg)).toFixed(2)
      return rsi_1h_result
    }

    //천 단위 쉼표
    function priceToString(price) 
    {
      let parts = price.toString().split("."); 
      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : ""); 
      //return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
        let exchange = Utils.getHtmlFromWeb("https://exchange.jaeheon.kr:23490/query/USDKRW")   
        exchange = exchange.split("[")[1]
        exchange = exchange.split(",")[0]

        binance = binance.split(",")[1]
        binance = binance.split(":")[1]
        binance = binance.split("}")[0]
        binance = binance.replace(/\"/g, "");

        let binkrw = exchange * binance

        //BTT 1:1000 액면분할로 인한 시세 차이 조정
        if (msg == "/btt" || msg == "/비트토렌트")
        {
          let diffPrice = (((parsingEtc(etc)*1000 - binkrw) / binkrw) * 100).toFixed(2)
        }
        else
        {
          let diffPrice = (((parsingEtc(etc) - binkrw) / binkrw) * 100).toFixed(2)
        } 
        return diffPrice
      }
    }

    //신규코인 전용 출력 함수
    function printNew(changer)
    {
        if (changer == "RISE")
        {
            return replier.reply(""+msg+"\n\n[현재가격]\n"+priceToString(parsingEtc(etc))+"원 (▲"+parsingChangePrice(changep)+"%) \n\n[김치프리미엄]\n"+exchangeKP(binance)+"% \n\n[금일최저가 ~ 금일최고가]\n"+priceToString(parsingLowPrice(lowp))+"원 ~ "+priceToString(parsingHighPrice(highp))+"원 \n\n[RSI Value]\n"+Rsi_1h(candle)+" \n\n[금일거래량]\n"+priceToString(parsingTotal(total))+"원 \n-Upbit");
        }
        else if (changer == "FALL")
        {
            return replier.reply(""+msg+"\n\n[현재가격]\n"+priceToString(parsingEtc(etc))+"원 (▼"+parsingChangePrice(changep)+"%) \n\n[김치프리미엄]\n"+exchangeKP(binance)+"% \n\n[금일최저가 ~ 금일최고가]\n"+priceToString(parsingLowPrice(lowp))+"원 ~ "+priceToString(parsingHighPrice(highp))+"원 \n\n[RSI Value]\n"+Rsi_1h(candle)+" \n\n[금일거래량]\n"+priceToString(parsingTotal(total))+"원 \n-Upbit");
        }
        else
        {
            return replier.reply(""+msg+"\n\n[현재가격]\n"+priceToString(parsingEtc(etc))+"원 (="+parsingChangePrice(changep)+"%) \n\n[김치프리미엄]\n"+exchangeKP(binance)+"% \n\n[금일최저가 ~ 금일최고가]\n"+priceToString(parsingLowPrice(lowp))+"원 ~ "+priceToString(parsingHighPrice(highp))+"원 \n\n[RSI Value]\n"+Rsi_1h(candle)+" \n\n[금일거래량]\n"+priceToString(parsingTotal(total))+"원 \n-Upbit");
        }
    }

    //출력 함수
    function printResult(changer)
    {
        if (changer == "RISE")
        {
            return replier.reply(""+msg+"\n\n[현재가격]\n"+priceToString(parsingEtc(etc))+"원 (▲"+parsingChangePrice(changep)+"%) \n\n[김치프리미엄]\n"+exchangeKP(binance)+"% \n\n[금일최저가 ~ 금일최고가]\n"+priceToString(parsingLowPrice(lowp))+"원 ~ "+priceToString(parsingHighPrice(highp))+"원 \n\n[RSI Value]\n"+Rsi(candle)+" \n\n[금일거래량]\n"+priceToString(parsingTotal(total))+"원 \n-Upbit");
        }
        else if (changer == "FALL")
        {
            return replier.reply(""+msg+"\n\n[현재가격]\n"+priceToString(parsingEtc(etc))+"원 (▼"+parsingChangePrice(changep)+"%) \n\n[김치프리미엄]\n"+exchangeKP(binance)+"% \n\n[금일최저가 ~ 금일최고가]\n"+priceToString(parsingLowPrice(lowp))+"원 ~ "+priceToString(parsingHighPrice(highp))+"원 \n\n[RSI Value]\n"+Rsi(candle)+" \n\n[금일거래량]\n"+priceToString(parsingTotal(total))+"원 \n-Upbit");
        }
        else
        {
            return replier.reply(""+msg+"\n\n[현재가격]\n"+priceToString(parsingEtc(etc))+"원 (="+parsingChangePrice(changep)+"%) \n\n[김치프리미엄]\n"+exchangeKP(binance)+"% \n\n[금일최저가 ~ 금일최고가]\n"+priceToString(parsingLowPrice(lowp))+"원 ~ "+priceToString(parsingHighPrice(highp))+"원 \n\n[RSI Value]\n"+Rsi(candle)+" \n\n[금일거래량]\n"+priceToString(parsingTotal(total))+"원 \n-Upbit");
        }
    }

    if (room == "TradingBot" || room == "SangKyu" || room == "TradingBot2" || room == "TradingBot3" || room == "TradingBot4" || room == "TradingBot5" || room == "TradingBot6")
    {
      if (msg == "/알고랜드"  || msg == "/algo" || msg == "/ALGO") 
      {

        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-algo")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-algo")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-algo")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-algo")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-algo")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-algo")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ALGOUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/minutes/60?market=krw-algo&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi_1h(candle)

        printNew(parsingChangeRate(changer))

        exchangeKP(binance)
        
      }

      if (msg == "/1인치"  || msg == "/1inch" || msg == "/1INCH") 
      {

        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-1inch")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-1inch")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-1inch")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-1inch")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-1inch")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-1inch")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=1INCHUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-1inch&count=14")
    
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

      if (msg == "/에이브"  || msg == "/aave" || msg == "/AAVE") 
      {

        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aave")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aave")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aave")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aave")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aave")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aave")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=AAVEUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-aave&count=14")
    
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


      if (msg == "/솔라나" || msg == "/솔루" || msg == "/sol" || msg == "/SOL") 
      {

        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sol")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sol")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sol")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sol")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sol")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sol")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SOLUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-sol&count=14")
    
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

      if (msg == "/누사이퍼" || msg == "/nu" || msg == "/NU") 
      {

        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-nu")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-nu")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-nu")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-nu")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-nu")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-nu")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=NUUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-nu&count=14")
    
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

      if (msg == "/폴리곤" || msg == "/matic" || msg == "/MATIC") 
      {

        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-matic")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-matic")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-matic")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-matic")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-matic")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-matic")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MATICUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-matic&count=14")
    
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

      if (msg == "/니어프로토콜" || msg == "/니어" || msg == "/near" || msg == "/NEAR") 
      {

        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-near")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-near")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-near")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-near")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-near")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-near")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=NEARUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-near&count=14")
        //let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/minutes/1?market=krw-near&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        Rsi_1h(candle)

        printNew(parsingChangeRate(changer))

        exchangeKP(binance)
        
      }

      if (msg == "/이클" || msg == "/이더리움클래식" || msg == "/etc" || msg == "/ETC") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-etc")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ETCUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-etc&count=14")
    
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

if (msg == "/이캐시" || msg == "/xec" || msg == "/XEC") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xec")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xec")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xec")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xec")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xec")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xec")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=XECUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-xec&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-vet")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=VETUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-vet&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hive")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=HIVEUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-hive&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xrp")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=XRPUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-xrp&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eos")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=EOSUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-eos&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btt")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BTTUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-btt&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-chz")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=CHZUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-chz&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-theta")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-theta")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-theta")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-theta")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-theta")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-theta")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=THETAUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-theta&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-gas")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=GASUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-gas&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btc")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BTCUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-btc&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ont")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ONTUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-ont&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-eth")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ETHUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-eth&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ada")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ADAUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-ada&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-med")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MEDUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-med&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dawn")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=DAWNUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-dawn&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qtum")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=QTUMUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-qtum&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-link")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=LINKUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-link&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-neo")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=NEOUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-neo&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ltc")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=LTCUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-ltc&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waves")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=WAVESUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-waves&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xlm")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=XLMUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-xlm&count=14")
    
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

      if (msg == "/폴카닷" || msg == "/꼴까닥" || msg == "/꼴가닥" || msg == "/dot" || msg == "/DOT") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dot")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=DOTUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-dot&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-trx")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=TRXUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-trx&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-maro")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MAROUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-maro&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hbar")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=HBARUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-hbar&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-snt")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SNTUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-snt&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ton")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=TONUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-ton&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cro")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=CROUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-cro&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stmx")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STMXUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-stmx&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mvl")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MVLUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-mvl&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-moc")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MOCUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-moc&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-pxl")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=PXLUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-pxl&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-powr")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-powr")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-powr")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-powr")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-powr")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-powr")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=POWRUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-powr&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sand")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sand")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sand")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sand")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sand")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sand")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SANDUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-sand&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bch")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BCHUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-bch&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bcha")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BCHAUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-bcha&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zil")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ZILUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-zil&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-btg")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BTGUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-btg&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-steem")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STEEMUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-steem&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sbd")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SBDUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-sbd&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-flow")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=FLOWUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-flow&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-omg")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=OMGUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-omg&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mlk")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MLKUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-mlk&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-sc")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SCUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-sc&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strk")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STRKUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-strk&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-meta")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-meta")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-meta")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-meta")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-meta")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-meta")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=METAUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-meta&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-storj")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STORJUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-storj&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-edr")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-edr")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-edr")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-edr")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-edr")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-edr")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=EDRUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-edr&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-doge")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=DOGEUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-doge&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tfuel")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tfuel")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tfuel")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tfuel")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tfuel")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tfuel")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=TFUELUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-tfuel&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strax")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strax")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strax")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strax")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strax")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-strax")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STRAXUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-strax&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aht")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aht")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aht")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aht")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aht")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aht")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=AHTUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-aht&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mana")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mana")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mana")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mana")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mana")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mana")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MANAUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-mana&count=14")
    
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

      if (msg == "/센티널프로토콜" || msg == "/upp" || msg == "/UPP") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-upp")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-upp")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-upp")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-upp")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-upp")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-upp")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=UPPUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-upp&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bat")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bat")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bat")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bat")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bat")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bat")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BATUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-bat&count=14")
    
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
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bora")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bora")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bora")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bora")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bora")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bora")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BORAUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-bora&count=14")
    
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

      if (msg == "/헌트"  || msg == "/hunt" || msg == "/HUNT") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hunt")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hunt")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hunt")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hunt")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hunt")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-hunt")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=HUNTUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-hunt&count=14")
    
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

      if (msg == "/카바"  || msg == "/kava" || msg == "/KAVA") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-kava")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-kava")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-kava")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-kava")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-kava")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-kava")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=KAVAUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-kava&count=14")
    
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

      if (msg == "/카이버네트워크"  || msg == "/knc" || msg == "/KNC") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-knc")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-knc")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-knc")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-knc")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-knc")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-knc")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=KNCUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-knc&count=14")
    
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

      if (msg == "/엔진코인" || msg == "/엔진" || msg == "/enj" || msg == "/ENJ") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-enj")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-enj")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-enj")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-enj")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-enj")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-enj")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ENJUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-enj&count=14")
    
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

      if (msg == "/온톨로지가스"  || msg == "/ong" || msg == "/ONG") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ong")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ong")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ong")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ong")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ong")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ong")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ONGUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-ong&count=14")
    
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

      if (msg == "/에스티피"  || msg == "/stpt" || msg == "/STPT") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stpt")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stpt")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stpt")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stpt")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stpt")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-stpt")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STPTUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-stpt&count=14")
    
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

      if (msg == "/피르마체인"  || msg == "/fct2" || msg == "/FCT2") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-fct2")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-fct2")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-fct2")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-fct2")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-fct2")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-fct2")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=FCT2USDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-fct2&count=14")
    
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

      if (msg == "/그로스톨코인"  || msg == "/grs" || msg == "/GRS") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-grs")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-grs")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-grs")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-grs")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-grs")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-grs")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=GRSUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-grs&count=14")
    
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

      if (msg == "/아이오에스티"  || msg == "/iost" || msg == "/IOST") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iost")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iost")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iost")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iost")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iost")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iost")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=IOSTUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-iost&count=14")
    
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

      if (msg == "/아르고"  || msg == "/aergo" || msg == "/AERGO") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aergo")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aergo")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aergo")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aergo")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aergo")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-aergo")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=AERGOUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-aergo&count=14")
    
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

      if (msg == "/메인프레임"  || msg == "/mft" || msg == "/MFT") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mft")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mft")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mft")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mft")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mft")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mft")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MFTUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-mft&count=14")
    
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

      if (msg == "/아크"  || msg == "/ark" || msg == "/ARK") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ark")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ark")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ark")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ark")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ark")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ark")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ARKUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-ark&count=14")
    
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

      if (msg == "/캐리프로토콜"  || msg == "/cre" || msg == "/CRE") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cre")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cre")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cre")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cre")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cre")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cre")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=CREUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-cre&count=14")
    
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

      if (msg == "/디카르고"  || msg == "/dka" || msg == "/DKA") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dka")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dka")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dka")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dka")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dka")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-dka")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=DKAUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-dka&count=14")
    
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

      if (msg == "/시빅"  || msg == "/cvc" || msg == "/CVC") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cvc")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cvc")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cvc")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cvc")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cvc")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-cvc")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=CVCUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-cvc&count=14")
    
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

      if (msg == "/메탈"  || msg == "/mtl" || msg == "/MTL") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mtl")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mtl")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mtl")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mtl")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mtl")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mtl")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MTLUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-mtl&count=14")
    
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

      if (msg == "/썬더토큰"  || msg == "/tt" || msg == "/TT") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tt")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tt")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tt")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tt")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tt")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-tt")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=TTUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-tt&count=14")
    
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

      if (msg == "/무비블록"  || msg == "/mbl" || msg == "/MBL") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mbl")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mbl")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mbl")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mbl")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mbl")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-mbl")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=MBLUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-mbl&count=14")
    
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

      if (msg == "/왁스"  || msg == "/waxp" || msg == "/WAXP") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waxp")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waxp")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waxp")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waxp")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waxp")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-waxp")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=WAXPUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-waxp&count=14")
    
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


      if (msg == "/오브스"  || msg == "/orbs" || msg == "/ORBS") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-orbs")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-orbs")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-orbs")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-orbs")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-orbs")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-orbs")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ORBSUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-orbs&count=14")
    
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

      if (msg == "/테조스"  || msg == "/xtz" || msg == "/XTZ") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-XTZ")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-XTZ")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-XTZ")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-XTZ")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-XTZ")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-XTZ")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=XTZUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-XTZ&count=14")
    
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

      if (msg == "/저스트"  || msg == "/jst" || msg == "/JST") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-JST")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-JST")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-JST")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-JST")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-JST")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-JST")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=JSTUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-JST&count=14")
    
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

      if (msg == "/스와이프"  || msg == "/sxp" || msg == "/SXP") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SXP")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SXP")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SXP")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SXP")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SXP")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SXP")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SXPUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-SXP&count=14")
    
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

      if (msg == "/플레이댑"  || msg == "/pla" || msg == "/PLA") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-PLA")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-PLA")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-PLA")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-PLA")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-PLA")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-PLA")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=PLAUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-PLA&count=14")
    
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

      if (msg == "/세럼"  || msg == "/srm" || msg == "/SRM") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SRM")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SRM")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SRM")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SRM")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SRM")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SRM")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SRMUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-SRM&count=14")
    
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

      if (msg == "/알파쿼크"  || msg == "/aqt" || msg == "/AQT") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-AQT")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-AQT")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-AQT")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-AQT")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-AQT")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-AQT")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=AQTUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-AQT&count=14")
    
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

      if (msg == "/골렘"  || msg == "/glm" || msg == "/GLM") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-GLM")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-GLM")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-GLM")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-GLM")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-GLM")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-GLM")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=GLMUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-GLM&count=14")
    
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

      if (msg == "/넴"  || msg == "/xem" || msg == "/XEM") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xem")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xem")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xem")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xem")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xem")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-xem")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=XEMUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-xem&count=14")
    
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

      if (msg == "/리스크"  || msg == "/lsk" || msg == "/LSK") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-lsk")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-lsk")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-lsk")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-lsk")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-lsk")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-lsk")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=LSKUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-lsk&count=14")
    
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

      if (msg == "/아더"  || msg == "/ardr" || msg == "/ARDR") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ardr")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ardr")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ardr")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ardr")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ardr")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ardr")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ARDRUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-ardr&count=14")
    
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

      if (msg == "/어거"  || msg == "/rep" || msg == "/REP") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-rep")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-rep")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-rep")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-rep")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-rep")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-rep")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=REPUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-rep&count=14")
    
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

      if (msg == "/아이콘"  || msg == "/icx" || msg == "/ICX") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-icx")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-icx")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-icx")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-icx")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-icx")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-icx")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ICXUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-icx&count=14")
    
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

      if (msg == "/폴리매쓰"  || msg == "/poly" || msg == "/POLY") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-poly")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-poly")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-poly")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-poly")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-poly")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-poly")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=POLYUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-poly&count=14")
    
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

      if (msg == "/제로엑스"  || msg == "/zrx" || msg == "/ZRX") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zrx")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zrx")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zrx")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zrx")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zrx")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-zrx")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ZRXUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-zrx&count=14")
    
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

      if (msg == "/룸네트워크"  || msg == "/loom" || msg == "/Loom") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-loom")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-loom")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-loom")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-loom")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-loom")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-loom")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=LoomUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-loom&count=14")
    
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

      if (msg == "/리퍼리움"  || msg == "/rfr" || msg == "/RFR") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-rfr")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-rfr")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-rfr")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-rfr")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-rfr")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-rfr")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=RFRUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-rfr&count=14")
    
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

      if (msg == "/에브리피디아"  || msg == "/iq" || msg == "/IQ") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iq")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iq")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iq")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iq")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iq")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iq")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=IQUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-iq&count=14")
    
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

      if (msg == "/아이오타"  || msg == "/iota" || msg == "/IOTA") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iota")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iota")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iota")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iota")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iota")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-iota")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=IOTAUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-iota&count=14")
    
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

      if (msg == "/엘프"  || msg == "/elf" || msg == "/ELF") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-elf")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-elf")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-elf")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-elf")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-elf")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-elf")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ELFUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-elf&count=14")
    
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

      if (msg == "/비트코인에스브이"  || msg == "/bsv" || msg == "/BSV") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bsv")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bsv")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bsv")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bsv")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bsv")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-bsv")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=BSVUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-bsv&count=14")
    
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

      if (msg == "/쿼크체인"  || msg == "/qkc" || msg == "/QKC") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qkc")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qkc")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qkc")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qkc")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qkc")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-qkc")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=QKCUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-qkc&count=14")
    
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

      if (msg == "/앵커"  || msg == "/ankr" || msg == "/ANKR") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ankr")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ankr")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ankr")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ankr")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ankr")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-ankr")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ANKRUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-ankr&count=14")
    
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

      if (msg == "/코스모스"  || msg == "/atom" || msg == "/ATOM") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-atom")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-atom")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-atom")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-atom")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-atom")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-atom")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=ATOMUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-atom&count=14")
    
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

      if (msg == "/썸씽"  || msg == "/ssx" || msg == "/SSX") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SSX")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SSX")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SSX")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SSX")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SSX")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-SSX")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=SSXUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-SSX&count=14")
    
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

      if (msg == "/코박토큰"  || msg == "/cbk" || msg == "/CBK") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-CBK")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-CBK")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-CBK")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-CBK")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-CBK")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-CBK")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=CBKUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-CBK&count=14")
    
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

      if (msg == "/휴먼스케이프"  || msg == "/hum" || msg == "/HUM") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-HUM")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-HUM")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-HUM")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-HUM")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-HUM")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-HUM")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=HUMUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-HUM&count=14")
    
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

      if (msg == "/펀디엑스"  || msg == "/pundix" || msg == "/PUNDIX") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-PUNDIX")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-PUNDIX")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-PUNDIX")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-PUNDIX")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-PUNDIX")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-PUNDIX")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=PUNDIXUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-PUNDIX&count=14")
    
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

      if (msg == "/엑시인피니티"  || msg == "/axs" || msg == "/AXS") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-AXS")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-AXS")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-AXS")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-AXS")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-AXS")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-AXS")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=AXSUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-AXS&count=14")
    
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
      
      if (msg == "/스택스"  || msg == "/stx" || msg == "/STX") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-STX")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-STX")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-STX")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-STX")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-STX")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-STX")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=STXUSDT")
        let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-STX&count=14")
    
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

      if (msg == "/위믹스"  || msg == "/wemix" || msg == "/WEMIX") 
      {
        let etc = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-WEMIX")
        let total = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-WEMIX")
        let highp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-WEMIX")
        let lowp = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-WEMIX")
        let changer = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-WEMIX")
        let changep = Utils.getHtmlFromWeb("https://api.upbit.com/v1/ticker?markets=KRW-WEMIX")
        let binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/price?symbol=WEMIXUSDT")
        //let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/days?market=krw-WEMIX&count=14")
        //let candle = Utils.getHtmlFromWeb("https://api.upbit.com/v1/candles/minutes/1?market=krw-WEMIX&count=14")
    
        parsingEtc(etc)

        parsingTotal(total)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        parsingChangeRate(changer)

        parsingChangePrice(changep)

        //Rsi(candle)
        //Rsi_1h(candle)

        //printResult(parsingChangeRate(changer))
        printNew(parsingChangeRate(changer))

        exchangeKP(binance)
      }

    //replier.markAsRead(TradingBot);
    }
}