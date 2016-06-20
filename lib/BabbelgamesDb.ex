defmodule BabbelgamesDb do
	def initDb() do
		{:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")
		Postgrex.query!(pid, "CREATE TABLE IF NOT EXISTS users(uid TEXT, email TEXT)", [])
	end
end