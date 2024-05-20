build:
	sudo docker build -t onlineide:infinity .
run_local:
	sudo docker run -p 5000:8000 onlineide:infinity
run:
	sudo docker run -p 5000:8000 darkmortal69/onlineide:infinity