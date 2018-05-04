FROM jrei/crystal-alpine

WORKDIR /tmp/app

ADD ./ /tmp/app/

RUN shards install
RUN mkdir /tmp/app/build

RUN crystal build sam.cr -o /tmp/app/build/sam.cr --release
RUN crystal build src/crystal-mirror.cr -o /tmp/app/build/crystal-mirror --release
RUN cp ./config.yml /tmp/app/build
RUN cp ./run.sh /tmp/app/build
ADD ./migrations /tmp/app/build/migrations

FROM jrei/crystal-alpine
WORKDIR /app/

COPY --from=0 /tmp/app/build /app/

RUN chmod +x run.sh
RUN mkdir /srv/crmirror && mkdir /srv/crmirror/mirror_keys && mkdir /srv/crmirror/git_repos

CMD ["./run.sh"]
