FROM jrei/crystal-alpine as builder

WORKDIR /tmp/app

ADD ./ /tmp/app/

RUN shards install
RUN mkdir /tmp/app/build

RUN crystal build sam.cr -o /tmp/app/build/sam.cr --release
RUN crystal build src/crystal-mirror.cr -o /tmp/app/build/crystal-mirror --release
RUN cp ./config.example.yml /tmp/app/build/config.yml
RUN cp ./run.sh /tmp/app/build
ADD ./migrations /tmp/app/build/migrations

FROM jrei/crystal-alpine

RUN apk update && apk add openssh git

WORKDIR /app/

COPY --from=builder /tmp/app/build /app/

RUN chmod +x run.sh
RUN mkdir /srv/crmirror && mkdir /srv/crmirror/mirror_keys && mkdir /srv/crmirror/git_repos

CMD ["./run.sh"]
