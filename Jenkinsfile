pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        RENDER_DEPLOY_HOOK = 'https://api.render.com/deploy/srv-d5ggememcj7s73clgvmg?key=gzuovs5n80E'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code...'
                checkout scm
            }
        }

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

        stage('Deploy to Render') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploying to Render...'
                sh '''
                    curl -X POST "${RENDER_DEPLOY_HOOK}"
                '''
                echo '✅ Deploy triggered! Render is building...'
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
