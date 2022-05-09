FROM ubuntu:latest

RUN apt update && \
    apt install curl wget -y &&\
    curl -sL https://deb.nodesource.com/setup_14.x &&\
    apt -y install gcc g++ python3 python3-pip nodejs npm && \
    pip3 install numpy &&\
    wget https://download.oracle.com/java/17/latest/jdk-17_linux-x64_bin.deb &&\
    apt install ./jdk-17_linux-x64_bin.deb -y &&\
    update-alternatives --install "/usr/bin/java" "java" "/usr/lib/jvm/jdk-17/bin/java" 1 &&\
    apt remove wget curl -y && \
    rm ./jdk-17_linux-x64_bin.deb &&\
    apt autoremove -y &&\
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/Docker
COPY . /usr/src/Docker

WORKDIR /usr/src/Docker

RUN npm install

CMD ["npm","start"]