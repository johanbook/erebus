# Install configuration files
install:
	ln -s /etc/logrotate.d/traefik ./config/logrotate.d/traefik

sync:
	rsync -v -a ~/erebus --exclude '.git' --exclude '/**/node_modules/' --exclude 'letsencrypt' book@erebus:~
