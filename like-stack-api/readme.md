dockerized like-stack server api

\$ heroku login

\$ heroku container:login

\$ heroku container:push web -a=like-stack-api-dock

\$ heroku container:release web -a=like-stack-api-dock
