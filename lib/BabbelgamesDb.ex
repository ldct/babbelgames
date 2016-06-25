defmodule BabbelgamesDb do
	def initDb() do
		{:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")
		Postgrex.query!(pid, """
			CREATE TABLE IF NOT EXISTS users (
				uid TEXT,
				user_email TEXT,
				constraint pk_users_user_email primary key (user_email)
			)
		""", [])
		Postgrex.query!(pid, """
			CREATE TABLE IF NOT EXISTS sessions (
				secret TEXT,
				user_email TEXT,
				constraint pk_sessions_user_email primary key (user_email)
			)
		""", [])
		Postgrex.query!(pid, """
			CREATE TABLE IF NOT EXISTS correct_pairs (
				user_email TEXT,
				episode_md5 TEXT,
				pairs TEXT[]
			)
		""", [])
	end

	def addSession(user_email, secret) do
		{:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")
		Postgrex.query!(pid, """
			INSERT INTO SESSIONS (user_email, secret) VALUES ($1, $2)
			ON CONFLICT ON CONSTRAINT pk_sessions_user_email DO UPDATE SET secret=$2
		""", [user_email, secret])
	end

	def addUser(email) do
		uid = UUID.uuid4()
		{:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")
		Postgrex.query!(pid, """
			INSERT INTO users (uid, user_email) VALUES ($1, $2) ON CONFLICT DO NOTHING
		""", [uid, email])
	end

	def markCorrectPair(episodeMD5, sessionToken, lineNumber, tileIdx) do
		{:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")
		%Postgrex.Result{
			num_rows: num_rows,
			rows: rows
		} = Postgrex.query!(pid, """
			SELECT user_email FROM SESSIONS WHERE secret = $1
		""", [sessionToken])

		if num_rows == 1 do
			[[user_email]] = rows
			IO.inspect(user_email)

			pair = Integer.to_string(lineNumber) <> "-" <> Integer.to_string(tileIdx)

			# TODO: create or append pair to array
			Postgrex.query!(pid, """
				INSERT INTO correct_pairs (user_email, episode_md5, pairs) VALUES ($1, $2, $3)
			""", [user_email, episodeMD5, [pair]])
		end



	end
end