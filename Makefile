sync:
	rsync -a services/ --exclude '/**/node_modules/' book@erebus:~
