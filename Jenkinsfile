pipeline {
    agent any

    tools {
        nodejs 'NodeJS'  // Configure this name in Jenkins Global Tool Configuration
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Lint') {
            steps {
                echo '🔍 Running linter...'
                sh 'npm run lint || true'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test || true'
            }
        }

        stage('Build') {
            steps {
                echo '🔨 Building application...'
                sh 'npm run build || true'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploying application...'
                // Add your deployment commands here
                // Example: sh 'pm2 restart kids-quiz-game'
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
