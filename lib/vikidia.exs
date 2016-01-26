defmodule Frex.Vikidia do

    def go do
        # this is mainly documentation
        getAllPages
        collectTitles       
    end

    def writeAllTranslatedSentences() do
        File.read!("vikidia/titles.json")
        |> Poison.decode!
        |> Enum.sort
        |> Enum.map(fn x -> 
            IO.inspect writeTranslatedSentenceIfNotExists x 
        end)
    end

    def writeTranslatedSentenceIfNotExists(title) do 
        unless File.exists?("vikidia/translated/" <> title <> ".json") do
            writeTranslatedSentence(title)    
        end
    end        

    def writeTranslatedSentence(title) do
        api_key = File.read! "GOOGLE_TRANSLATE_API_KEY"
        loc = "https://fr.vikidia.org/wiki/" <> title

        pocket_endpoint = "http://text.readitlater.com/v3beta/text"
        pocket_url = pocket_endpoint <> "?" <> URI.encode_query(%{
          "images" => 0,
          "output" => "json",
          "msg" => 1,
          "url" => loc
        })

        response = HTTPotion.get pocket_url,  [timeout: 500_000]

        sentence = response.body
        |> Poison.decode!
        |> Map.fetch!("excerpt")
        |> String.split(".")
        |> List.first

        sentence = sentence <> "."

        url = "https://www.googleapis.com/language/translate/v2?" <> URI.encode_query(%{
            "target" => "en",
            "source" => "fr",
            "key" => api_key,
            "q" => sentence
        }) 
        body = Poison.decode! ((HTTPotion.get url,  [timeout: 500_000]).body)

        tt = body
        |> Map.fetch!("data")
        |> Map.fetch!("translations")
        |> List.first
        |> Map.fetch!("translatedText")

        res = Poison.encode!(%{
            loc: loc,
            original: sentence,
            translated: tt
        })
        File.write! "vikidia/translated/" <> title <> ".json", res, [:write]
    end

    def cleanAllpage(filename) do
        File.read!("vikidia/allpages/" <> filename)
        |> Poison.decode!
        |> Map.fetch!("query")
        |> Map.fetch!("allpages")
        |> Enum.map(fn x -> x["title"] end)
    end

    def collectTitles() do
        contents = File.ls!("vikidia/allpages")
        |> Enum.sort
        |> Enum.map(fn x -> 
            cleanAllpage x 
        end)
        |> List.flatten

        File.write! "vikidia/titles.json", Poison.encode!(contents), [:write]
    end

    def writeToFile(contents, key) do
        keyNs = String.replace key, "/", "___"
        File.write! "vikidia/allpages/" <> keyNs, Poison.encode!(contents), [:write]
        contents
    end

    def getAllPages do
        vikidia_url = "https://fr.vikidia.org/w/api.php?action=query&list=allpages&rawcontinue=&format=json"

        response = HTTPotion.get vikidia_url, [timeout: 20_000]
        response.body
        |> Poison.decode!
        |> IO.inspect
        |> writeToFile("initial")
        |> Map.fetch!("query-continue")
        |> Map.fetch!("allpages")
        |> Map.fetch!("apcontinue")
        |> getPagesStarting
    end

    def getPagesStarting(apcontinue) do
        vikidia_url = "https://fr.vikidia.org/w/api.php?action=query&list=allpages&rawcontinue=&format=json"
        vikidia_url = vikidia_url <> "&apcontinue=" <> URI.encode(apcontinue)

        IO.inspect "hi"
        IO.inspect vikidia_url

        response = HTTPotion.get vikidia_url, [timeout: 20_000]

        IO.inspect response.body

        response.body
        |> Poison.decode!
        |> IO.inspect
        |> writeToFile(apcontinue)
        |> Map.fetch!("query-continue")
        |> Map.fetch!("allpages")
        |> Map.fetch!("apcontinue")
        |> getPagesStarting
    end

    def printSum(a, b) do
        IO.inspect a+b
    end
end
