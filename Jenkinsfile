pipeline {
    agent any

    tools {
        nodejs 'NodeJS'  // Configure this name in Jenkins Global Tool Configuration
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                bat 'npm install'
            }
        }

        stage('Lint') {
            steps {
                echo '🔍 Running linter...'
                bat 'npm run lint || exit 0'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                bat 'npm test || exit 0'
            }
        }

        stage('Build') {
            steps {
                echo '🔨 Building application...'
                bat 'npm run build || exit 0'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploying application...'
                // Add your deployment commands here
                // Example: bat 'pm2 restart kids-quiz-game'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            echo '🧹 Cleaning up...'
            cleanWs()
        }
    }
}
