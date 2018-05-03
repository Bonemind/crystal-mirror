FROM crystallang/crystal

WORKDIR /tmp/app

ADD ./ /tmp/app/

RUN shards install
RUN mkdir /tmp/app/build

RUN crystal build sam.cr -o /tmp/app/build/sam.cr --release
RUN crystal build src/crystal-mirror.cr -o /tmp/app/build/crystal-mirror --release
RUN cp ./config.yml /tmp/app/build

FROM crystallang/crystal
WORKDIR /app/

COPY --from=0 /tmp/app/build /app/

CMD ["./crystal-mirror"]
