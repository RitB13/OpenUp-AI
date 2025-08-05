const { useState, useEffect, useRef } = React;

const App = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);

    // Debug logging
    console.log('App render - activeSection:', activeSection, 'messages:', messages.length);

    useEffect(() => {
        console.log('useEffect triggered - messages changed:', messages.length);
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => {
        console.log('useEffect triggered - activeSection changed:', activeSection);
    }, [activeSection]);

    const handleSendMessage = async () => {
        console.log('handleSendMessage called, current activeSection:', activeSection);
        
        if (inputValue.trim() === '') return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        console.log('Adding user message:', userMessage);
        setMessages(prev => {
            console.log('Previous messages:', prev);
            const newMessages = [...prev, userMessage];
            console.log('New messages:', newMessages);
            return newMessages;
        });
        
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user_input: userMessage.text })
            });

            const data = await response.json();

            const aiMessage = {
                id: Date.now() + 1,
                text: data.response || "Sorry, I didn't understand that.",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                emotion: "🤗"
            };

            console.log('Adding AI message:', aiMessage);
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error calling API:", error);

            const aiMessage = {
                id: Date.now() + 1,
                text: "Oops! Something went wrong. Please try again later.",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                emotion: "⚠️"
            };

            setMessages(prev => [...prev, aiMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const scrollToChat = () => {
        setActiveSection('chat');
        setTimeout(() => {
            const chatSection = document.getElementById('chat-section');
            if (chatSection) {
                chatSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const restartChat = () => {
        setMessages([]);
        setInputValue('');
        setIsTyping(false);
    };

    const goHome = () => {
        setActiveSection('home');
    };

    return (
        <>
            {activeSection === 'home' && (
                <div className="min-h-screen">
                    {/* Hero Section */}
                    <header className="gradient-bg text-white py-16 px-4">
                        <div className="max-w-6xl mx-auto text-center">
                            <div className="flex items-center justify-center mb-6">
                                <svg className="w-12 h-12 text-blue-300 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                                <h1 className="text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                                    <span className="text-black-500 drop-shadow-sm">OpenUp</span>{' '}
                                    <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-sm animate-pulse">AI</span>
                                </h1>
                            </div>
                            <p className="text-xl text-gray-600 mb-8">Your AI-Powered Emotional Support Companion</p>
                            <div className="text-2xl font-medium mb-8 text-blue-600">
                                ✨ <span className="text-blue-600 font-semibold">Talk. Vent. Heal. Privately.</span>
                            </div>
                            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
                                A calm and safe space where you can express your thoughts, fears, and emotions.
                                Powered by advanced AI trained on mental wellness patterns, I listen and respond with
                                genuine care.
                            </p>
                            <div className="flex flex-wrap justify-center mb-8">
                                <div className="pill-badge">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                    </svg>
                                    24/7 Support
                                </div>
                                <div className="pill-badge">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    Completely Private
                                </div>
                                <div className="pill-badge">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                    Non-Judgmental
                                </div>
                            </div>
                            <button onClick={scrollToChat} className="start-btn">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Start Conversation
                            </button>
                            <div className="mt-4 text-sm text-gray-700">
                                Free to use • No sign-up required • Your privacy protected
                            </div>
                        </div>
                    </header>

                    {/* Key Features Section */}
                    <section className="py-16 px-4" style={{background: '#f8fafc'}}>
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Key Features</h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <div className="flex items-start mb-4">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 mt-2"></div>
                                            <p className="text-gray-700">Natural, emotionally intelligent conversations</p>
                                        </div>
                                        <div className="flex items-start mb-4">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 mt-2"></div>
                                            <p className="text-gray-700">Powered by advanced language models trained on mental wellness</p>
                                        </div>
                                        <div className="flex items-start mb-4">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 mt-2"></div>
                                            <p className="text-gray-700">Evidence-informed responses for anxiety, stress, and emotional distress</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-start mb-4">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-2"></div>
                                            <p className="text-gray-700">Grounding techniques and coping strategies</p>
                                        </div>
                                        <div className="flex items-start mb-4">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-2"></div>
                                            <p className="text-gray-700">Safe space to express thoughts and emotions</p>
                                        </div>
                                        <div className="flex items-start mb-4">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-2"></div>
                                            <p className="text-gray-700">Immediate emotional support when you need it</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Important Disclaimer */}
                            <div className="disclaimer-box">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-3">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-orange-800 mb-2">Important Disclaimer</h3>
                                        <p className="text-orange-800 mb-4">
                                            <strong>Therapist AI is not a licensed mental health professional.</strong> It cannot diagnose, treat, or prescribe medication. This AI is designed to provide
                                            emotional support and coping strategies, but it is not a substitute for professional therapy or medical care. If you're experiencing severe
                                            depression, anxiety, or thoughts of self-harm, please consult a certified therapist, counselor, or contact a mental health crisis line immediately.
                                        </p>
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                </svg>
                                                <span className="text-sm font-medium text-red-800">Crisis Resources:</span>
                                            </div>
                                            <p className="text-sm text-red-700 mt-1">National Suicide Prevention Lifeline: 988 | Crisis Text Line: Text HOME to 741741</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* About Therapist AI */}
                    <section className="py-16 px-4" style={{background: '#f1f5f9'}}>
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">About Therapist AI</h2>
                                <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                                    Therapist AI is built on modern AI technology integrated with evidence-based
                                    mental wellness knowledge to bring you comforting, intelligent responses to
                                    emotional concerns. Created as a compassionate first step toward better
                                    emotional wellbeing.
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="feature-card text-center">
                                    <div className="icon-circle">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Emotionally Intelligent</h3>
                                    <p className="text-gray-600">
                                        Advanced AI trained on mental wellness patterns to provide empathetic, caring
                                        responses to your emotional needs.
                                    </p>
                                </div>

                                <div className="feature-card text-center">
                                    <div className="icon-circle">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">AI-Powered Support</h3>
                                    <p className="text-gray-600">
                                        Built with state-of-the-art language models to understand and respond to
                                        complex emotional situations with nuance.
                                    </p>
                                </div>

                                <div className="feature-card text-center">
                                    <div className="icon-circle">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11C15.4,11 16,11.4 16,12V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V12C8,11.4 8.4,11 9,11V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Private & Secure</h3>
                                    <p className="text-gray-600">
                                        Your conversations are confidential. We prioritize your privacy and emotional
                                        safety above everything else.
                                    </p>
                                </div>

                                <div className="feature-card text-center">
                                    <div className="icon-circle">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Always Available</h3>
                                    <p className="text-gray-600">
                                        24/7 emotional support when you need it most. No appointments, no waiting -
                                        just immediate care and understanding.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Start Conversation Section */}
                    <section className="py-16 px-4" style={{background: '#f8fafc'}}>
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Your Conversation</h2>
                            <p className="text-xl text-gray-600 mb-8">
                                I'm here to listen without judgment. Share what's on your mind, and
                                let's work through it together.
                            </p>
                            <button onClick={scrollToChat} className="start-btn">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Start Conversation
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {activeSection === 'chat' && (
                <div className="min-h-screen flex flex-col bg-gray-50" id="chat-section">
                    <header className="bg-white border-b border-gray-200 py-4 px-4">
                        <div className="max-w-4xl mx-auto flex justify-between items-center">
                            <div className="flex items-center">
                                <button 
                                    onClick={goHome}
                                    className="mr-3 p-2 text-gray-600 hover:text-gray-800 transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">AI</span>
                                </div>
                                <div>
                                    <h1 className="text-lg font-semibold text-gray-800">OpenUp AI</h1>
                                    <p className="text-sm text-gray-600">Your emotional support companion</p>
                                </div>
                            </div>
                            <button 
                                onClick={restartChat}
                                className="flex items-center text-gray-600 hover:text-gray-800 transition"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Restart
                            </button>
                        </div>
                    </header>

                    <main className="flex-grow flex flex-col max-w-4xl mx-auto w-full">
                        <div className="flex-grow p-4 overflow-y-auto" ref={chatContainerRef}>
                            {messages.length === 0 && !isTyping && (
                                <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 max-w-2xl">
                                    <p className="text-gray-700">
                                        Hello there! I'm your AI emotional support companion. I'm here to listen and provide a safe 
                                        space for you to share what's on your mind. How are you feeling today?
                                    </p>
                                    <div className="text-xs text-gray-500 mt-2">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            )}

                            {messages.map((message) => (
                                <div 
                                    key={message.id} 
                                    className={`mb-4 ${message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                                >
                                    <div className="flex flex-col max-w-2xl">
                                        <span className="text-xs text-gray-500 mb-1">
                                            {message.sender === 'user' ? 'You' : 'AI'}
                                        </span>
                                        <div className={`${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} p-4 shadow-sm`}>
                                            <p className="text-gray-800">{message.text}</p>
                                            {message.sender === 'ai' && message.emotion && (
                                                <div className="text-xl mt-2">{message.emotion}</div>
                                            )}
                                            <div className="text-xs text-gray-500 mt-2">{message.timestamp}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start mb-4">
                                    <div className="chat-bubble-ai p-4 shadow-sm">
                                        <div className="typing-dots">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1 ml-2">Thinking...</span>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Share what's on your mind..."
                                    className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows="2"
                                />
                                <button
                                    type="button"
                                    onClick={handleSendMessage}
                                    disabled={inputValue.trim() === ''}
                                    className={`bg-blue-600 text-white px-4 h-full rounded-r-lg flex items-center justify-center ${inputValue.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-2 text-xs text-gray-500 text-center">
                                Press <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for new line
                            </div>
                        </div>
                    </main>

                    <footer className="bg-gray-50 py-4 px-4 border-t border-gray-200">
                        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
                            <p>OpenUp AI - Your AI-Powered Emotional Support Companion</p>
                            <p className="mt-1">Free to use · No sign-up required · Your privacy protected</p>
                        </div>
                    </footer>
                </div>
            )}
        </>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));