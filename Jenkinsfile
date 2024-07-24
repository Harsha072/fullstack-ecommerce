pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the code'
                // Checkout code from the version control system
                git https://github.com/Harsha072/fullstack-ecommerce.git
               
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
                    script {
                        def testResult = bat(script: 'npm run test:ci', returnStatus: true)
                        if (testResult != 0) {
                            error 'Angular tests failed. Stopping the pipeline.'
                        }
                    }
                }
            }
        }

        stage('Build Angular') {
            steps {
                dir('frontend/angular-ecommerce') {
                    echo 'Building Angular application...'
                    bat 'npm run build'
                }
            }
        }

        stage('Install Dependencies - Maven') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Installing Maven dependencies...'
                    // Clean previous build artifacts and install dependencies
                    bat 'mvn clean install -DskipTests'
                }
            }
        }

        stage('Run Tests - Maven') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Running Maven tests...'
                    script {
                        def testResult = bat(script: 'mvn test', returnStatus: true)
                        if (testResult != 0) {
                            error 'Maven tests failed. Stopping the pipeline.'
                        }
                    }
                }
            }
        }

        stage('Build JAR - Maven') {
            steps {
                dir('backend/spring-boot-ecommerce') {
                    echo 'Building JAR file...'
                    // Build the JAR file
                    bat 'mvn package -DskipTests'
                }
            }
        }

       
    }

    post {
        success {
            echo 'All tests and builds completed successfully!'
        }
        failure {
            echo 'Some tests or builds failed.'
        }
    }
}
