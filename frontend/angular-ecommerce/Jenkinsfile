pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Print a message to indicate the checkout stage
                bat 'echo Checking out the code'
            }
        }
        
        stage('Install Dependencies') {
            steps {
               
                    // Install Node.js dependencies
                    bat 'echo Installing Node.js dependencies...'
                 
                
            }
        }
        
        stage('Run Tests') {
            steps {
              
                    // Run unit tests
                    bat 'echo Running tests...'
               
                
            }
        }
    }
    
    post {
        success {
            // Print a success message
            bat 'echo Tests completed successfully!'
        }
        failure {
            // Print a failure message
            bat 'echo Tests failed.'
        }
    }
}
