# Install configuration files
install:
	ln -s /etc/logrotate.d/traefik ./config/logrotate.d/traefik

sync:
	rsync -a services/ --exclude '/**/node_modules/' book@erebus:~
