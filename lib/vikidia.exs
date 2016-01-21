defmodule Frex.Vikidia do

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
