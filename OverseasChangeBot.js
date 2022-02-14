function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {
    
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
      highp = highp.split(",")[12]
      highp = highp.split(":")[1]
      highp = highp.replace(/\"/g, "");

      if (msg.includes("/b비트") || msg.includes("/bbtc") || msg.includes("/BBTC"))
      {
        return parseFloat(highp).toFixed(2)
      }
      else
      {
        return parseFloat(highp).toFixed(6)
      }
    }

    //금일 최저가
    function parsingLowPrice(lowp)
    {
      lowp = lowp.split(",")[13]
      lowp = lowp.split(":")[1]
      lowp = lowp.replace(/\"/g, "");

      if (msg.includes("/b비트") || msg.includes("/bbtc") || msg.includes("/BBTC"))
      {
        return parseFloat(lowp).toFixed(2)
      }
      else
      {
        return parseFloat(lowp).toFixed(6)
      }
    }

    //금일 변동율
    /*function parsingChangeRate(changer)
    {
        changer = changer.split(",")[100]
        changer = changer.split(":")[1]
        return changer = changer.replace(/\"/g, "");
    }*/

    //금일 변동퍼센트
    function parsingChangePrice(changep)
    {
        changep = changep.split(",")[2]
        changep = changep.split(":")[1]
        var changeRatio = changep.replace(/\"/g, "");
        return parseFloat(changeRatio).toFixed(2);
    }

    //현재 가격 소숫점 6자리 까지 표시
    function priceToString(price) 
    {
      if (msg.includes("/b비트") || msg.includes("/bbtc") || msg.includes("/BBTC"))
      {
        return price.toFixed(2);
      }
      else
      {
        return price.toFixed(6);
      }
    }    

    //바이낸스 가격계산
    function binancePrice(binance)
    {
      //null 처리 기능(Binance에 없는 data 일 경우)
      if (binance == null)
      {
        return "(미지원)NaN"
      }
      else
      {
        //var exchange = Utils.getHtmlFromWeb("https://exchange.jaeheon.kr:23490/query/USDKRW")   
        //exchange = exchange.split("[")[1]
        //exchange = exchange.split(",")[0]

        binance = binance.split(",")[5]
        binance = binance.split(":")[1]
        //binance = binance.split("}")[0]
        binance = binance.replace(/\"/g, "");

        //let binkrw = exchange * binance
        return parseFloat(binance)
      }
    }
    
    //Rsi Candle 지표 계산 (계산 알고리즘 변경으로 인해 임시 주석처리)
    /*function Rsi(candle)
    {
      let j = 4
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
        candle_Num[i] = candle.split(",")[j].replace(/\"/g, "");
        candle_Num[i] = parseFloat(candle_Num[i]);

        if(i < 13)
        {
          candle_Num[i] = candle_Num[i] - candle_Num[i+1];
        }
        else
        {
          
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
        j = j + 12
      }

      rsi_asum = ascend_sum;
      rsi_dsum = descend_sum;

      rsi_aavg = rsi_asum / 14
      rsi_davg = Math.abs(rsi_dsum) / 14

      //by Formula Bitcoin Trading Labs
      rsi_result = (100 * rsi_aavg / (rsi_aavg + rsi_davg)).toFixed(2)
      return rsi_result
    }*/

    //바이낸스 출력
    function binanceResult(price)
    {
      //var fixPrice = price.toFixed(2)
      if (parsingChangePrice(changep) > 0)
      {
        return replier.reply(""+msg+"\n\n[현재가격]\n$"+priceToString(price)+" (▲"+parsingChangePrice(changep)+"%) \n\n[금일최저가 ~ 금일최고가]\n$"+parsingLowPrice(lowp)+" ~ $"+parsingHighPrice(highp)+"\n-By Binance")
      }

      else if (parsingChangePrice(changep) < 0)
      {
        return replier.reply(""+msg+"\n\n[현재가격]\n$"+priceToString(price)+" (▼"+parsingChangePrice(changep)+"%) \n\n[금일최저가 ~ 금일최고가]\n$"+parsingLowPrice(lowp)+" ~ $"+parsingHighPrice(highp)+"\n-By Binance")
      }

      else
      {
        return replier.reply(""+msg+"\n\n[현재가격]\n$"+priceToString(price)+" (="+parsingChangePrice(changep)+"%) \n\n[금일최저가 ~ 금일최고가]\n$"+parsingLowPrice(lowp)+" ~ $"+parsingHighPrice(highp)+"\n-By Binance")
      }
    }
      
      if (msg.includes("/클레이") || msg == "/klay" || msg == "/KLAY") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=KLAYUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=KLAYUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=KLAYUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=KLAYUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=KLAYUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=KLAYUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=KLAYUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/호라이젠" || msg == "/zen" || msg == "/ZEN") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ZENUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ZENUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ZENUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ZENUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ZENUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ZENUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=ZENUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/마스크" || msg == "/mask" || msg == "/MASK") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=MASKUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=MASKUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=MASKUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=MASKUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=MASKUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=MASKUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=MASKUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/아발란체" || msg == "/avax" || msg == "/AVAX") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=AVAXUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=AVAXUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=AVAXUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=AVAXUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=AVAXUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=AVAXUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=AVAXUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/바이낸스코인" || msg == "/bnb" || msg == "/BNB") 
      {
        
         var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=BNBUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=BNBUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=BNBUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=BNBUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=BNBUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=BNBUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=BNBUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/레이디움" || msg == "/ray" || msg == "/RAY") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RAYUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RAYUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RAYUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RAYUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RAYUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RAYUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=RAYUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/시바이누" || msg == "/shib" || msg == "/SHIB") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=SHIBUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=SHIBUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=SHIBUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=SHIBUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=SHIBUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=SHIBUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=SHIBUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/앨리스" || msg == "/alice" || msg == "/ALICE") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ALICEUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ALICEUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ALICEUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ALICEUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ALICEUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ALICEUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=ALICEUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/홀로체인" || msg == "/hot" || msg == "/HOT" || msg.includes("핫소스")) 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=HOTUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=HOTUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=HOTUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=HOTUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=HOTUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=HOTUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=HOTUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/킵네트워크" || msg == "/킵" || msg == "/keep" || msg == "/KEEP") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=KEEPUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=KEEPUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=KEEPUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=KEEPUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=KEEPUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=KEEPUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=KEEPUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/와지르엑스" || msg == "/wrx" || msg == "/WRX") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=WRXUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=WRXUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=WRXUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=WRXUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=WRXUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=WRXUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=WRXUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/갈라" || msg == "/gala" || msg == "/GALA") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=GALAUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=GALAUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=GALAUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=GALAUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=GALAUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=GALAUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=GALAUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg.includes("/비토르") || msg == "/vtho" || msg == "/VTHO") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=VTHOUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=VTHOUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=VTHOUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=VTHOUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=VTHOUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=VTHOUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=VTHOUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg.includes("/b비트") || msg == "/bbtc" || msg == "/BBTC") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=BTCUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=BTCUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=BTCUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=BTCUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=BTCUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=BTCUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=VTHOUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg.includes("/b이더") || msg == "/beth" || msg == "/BETH") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ETHUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ETHUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ETHUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ETHUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ETHUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=ETHUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=VTHOUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/b솔라나" || msg == "/bsol" || msg == "/BSOL") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=SOLUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=SOLUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=SOLUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=SOLUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=SOLUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=SOLUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=VTHOUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/ygg" || msg == "/YGG") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=YGGUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=YGGUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=YGGUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=YGGUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=YGGUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=YGGUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=VTHOUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg.includes("/b니어") || msg == "/bnear" || msg == "/BNEAR") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=NEARUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=NEARUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=NEARUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=NEARUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=NEARUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=NEARUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=NEARUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/루나" || msg == "/luna" || msg == "/LUNA") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=LUNAUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=LUNAUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=LUNAUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=LUNAUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=LUNAUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=LUNAUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=LUNAUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/깃" || msg == "/gtc" || msg == "/GTC") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=GTCUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=GTCUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=GTCUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=GTCUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=GTCUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=GTCUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=GTCUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/오션" || msg == "/ocean" || msg == "/OCEAN") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=OCEANUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=OCEANUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=OCEANUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=OCEANUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=OCEANUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=OCEANUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=OCEANUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/b리플" || msg == "/bxrp" || msg == "/BXRP") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=XRPUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=XRPUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=XRPUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=XRPUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=XRPUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=XRPUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=XRPUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg.includes("/b스텔라") || msg == "/bxlm" || msg == "/BXLM") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=XLMUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=XLMUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=XLMUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=XLMUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=XLMUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=XLMUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=XRPUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/b트론" || msg == "/btrx" || msg == "/BTRX") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=TRXUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=TRXUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=TRXUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=TRXUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=TRXUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=TRXUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=XRPUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/연파이낸스" || msg == "/yfi" || msg == "/YFI") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=YFIUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=YFIUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=YFIUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=YFIUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=YFIUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=YFIUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=YFIUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/파일코인" || msg == "/fil" || msg == "/FIL") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=FILUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=FILUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=FILUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=FILUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=FILUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=FILUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=XRPUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/유니스왑" || msg == "/uni" || msg == "/UNI") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=UNIUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=UNIUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=UNIUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=UNIUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=UNIUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=UNIUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=XRPUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/레이븐" || msg == "/rvn" || msg == "/RVN") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RVNUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RVNUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RVNUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RVNUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RVNUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RVNUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=RVNUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }

      if (msg == "/리저브라이트" || msg == "/rsr" || msg == "/RSR") 
      {
        
        var binance = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RSRUSDT")
        var total = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RSRUSDT")
        var highp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RSRUSDT")
        var lowp = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RSRUSDT")
        var changer = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RSRUSDT")
        var changep = Utils.getHtmlFromWeb("https://api.binance.com/api/v1/ticker/24hr?symbol=RSRUSDT")
        //var candle = Utils.getHtmlFromWeb("https://www.binance.com/api/v3/klines?symbol=RSRUSDT&limit=14&interval=1d")
        
        parsingHighPrice(highp)

        parsingChangePrice(changep)

        parsingHighPrice(highp)
    
        parsingLowPrice(lowp)

        //Rsi(candle)

        binanceResult(binancePrice(binance))
      }
}