pipeline {
    agent any
    stages {
        stage('Print Environment') {
            steps {
                script {
                    bat 'printenv'
                    bat 'node -v'
                    bat 'npm -v'
                }
            }
        }
        // other stages
    }
}
