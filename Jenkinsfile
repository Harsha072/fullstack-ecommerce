pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the code'
                
            }
        }

        stage('Install Dependencies - Maven') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Installing Maven dependencies...'
                    bat 'mvn clean install'
                }
            }
        }

        stage('Run Tests - Maven') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Running Maven tests...'
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        bat 'mvn test'
                    }
                }
            }
        }

        stage('Install Dependencies - Angular') {
            steps {
                dir('frontend/angular-ecommerce') {
                    echo 'Installing Node.js dependencies...'
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests - Angular') {
            steps {
                dir('frontend/angular-ecommerce') {
                    echo 'Running Angular tests...'
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        bat 'npm run test:ci'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'All tests completed successfully!'
        }
        failure {
            echo 'Some tests failed.'
        }
    }
}
