pipeline {
    agent any
    stages {
        stage('Print Environment') {
            steps {
                script {
                    bat 'set' // Prints all environment variables
                    bat 'node -v' // Prints Node.js version
                    bat 'npm -v' // Prints npm version
                }
            }
        }
        // other stages
    }
}
