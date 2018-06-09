## RoostR.js project installation guide

You just cloned RoostR.js : git clone https://github.com/LCluber/RoostR.js.git


### Install nodejs 4 on your server :
  - Windows and OSX : **https://nodejs.org/en/**
  - Linux master race : run
    - **curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -**
    - **sudo apt-get install -y nodejs**


### Install bower :
  - Run **npm install -g bower**


### Install ruby :
  - Windows : **http://rubyinstaller.org/downloads/**
  - OSX : already installed
  - Linux master race : run **sudo apt-get install ruby-full**


### Install sass :
  - Run **gem install sass**


### Install grunt :
  - Run **npm update -g npm** to update npm
  - Run **npm install -g grunt-cli**


### Install project dependencies
  - Run **npm install** from your project directory
  - Run **bower install** from your project directory


### Workflow
  - Use **grunt --help** to see the list of tasks.
  - Run **grunt** build library, website, launch server, open website and watch for changes.

  - You can use those commands to build specific parts :
    - **grunt doc** build the documentation in the doc/ folder,
    - **grunt lib** build the library in the dist/ folder and the documentation in the doc/ folder,
    - **grunt website** build the website in the website/ folder,
    - **grunt dist** build library and website,
    - **grunt serve** launch server, open website and watch for changes,
    - Start Express server manually :
      - Windows : Run **set DEBUG=RoostRjs:* & npm start**
      - Linux / OSX : Run **DEBUG=RoostRjs:* npm start**
    - Go to **http://localhost:3004/** to test the app.
    - Keep in mind running **grunt** once will do all this automatically.
    
    
  - Set node environment if needed : 
    - Run **export NODE_ENV=development**
    - Or **export NODE_ENV=production**
