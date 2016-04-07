# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.proxy.http     = "http://sydproxy.acp.net:8080"
  config.proxy.https    = "http://sydproxy.acp.net:8080"
  config.proxy.no_proxy = "localhost,127.0.0.1"
  config.apt_proxy.http = "http://sydproxy.acp.net:8080"

  # Create a forwarded port mapping which allows access to a specific port
  config.vm.network "forwarded_port", guest: 3000, host: 3000

  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.synced_folder ".", "/vagrant", type: "rsync", rsync__exclude: [".git/", ".idea/", "node_modules/"]

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  config.vm.network "public_network"

   config.vm.provider "virtualbox" do |vb, override|
     # Customize the amount of memory on the VM:
      vb.memory = "4096"
   end

  config.vm.provision "fix-no-tty", type: "shell" do |s|
    s.privileged = false
    s.inline = "sudo sed -i '/tty/!s/mesg n/tty -s \\&\\& mesg n/' /root/.profile"
  end

  config.vm.provision "shell", privileged: false, inline: <<-SHELL
     sudo apt-get update
	 sudo apt-get install -y build-essential g++ git-core curl

	 # Install Node
	 curl https://raw.githubusercontent.com/creationix/nvm/v0.23.3/install.sh | bash
     source ~/.nvm/nvm.sh
     nvm install 5.0
     nvm alias default 5.0

	 # Set npm registry
     npm set registry http://npm.digital.bauer-media.net.au -g

     # Nodemon
	 npm install -g nodemon

	 # npm install
	 cd /vagrant
	 npm install
  SHELL
end