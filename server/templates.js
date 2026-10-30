// ====================================================================
// EMBEDX INTERACTIVE - PRELOADED TEMPLATES
// Embedded Systems & Automation Club, SRM TRP Engineering College
// ====================================================================

export const DEFAULT_TEMPLATES = [
  {
    id: "template-embedded-systems",
    title: "Embedded Systems Knowledge Quiz",
    description: "Test participants' knowledge of microcontrollers, memory architectures, interrupts, and embedded C.",
    category: "Technical Quiz",
    coverColor: "from-blue-600 to-indigo-900",
    slides: [
      {
        id: "s1",
        orderIndex: 0,
        type: "quiz",
        title: "Which architecture separates program code and data memory?",
        description: "Choose the correct computer architecture widely used in microcontrollers like AVR.",
        timerSeconds: 20,
        points: 1000,
        speedBonus: true,
        options: [
          { id: "o1", text: "Von Neumann Architecture", isCorrect: false },
          { id: "o2", text: "Harvard Architecture", isCorrect: true },
          { id: "o3", text: "Turing Architecture", isCorrect: false },
          { id: "o4", text: "CISC Architecture", isCorrect: false }
        ]
      },
      {
        id: "s2",
        orderIndex: 1,
        type: "quiz",
        title: "What is the primary function of a Watchdog Timer (WDT)?",
        description: "A critical fail-safe peripheral in embedded systems.",
        timerSeconds: 20,
        points: 1000,
        speedBonus: true,
        options: [
          { id: "o1", text: "Calculate precise clock drift", isCorrect: false },
          { id: "o2", text: "Reset the microcontroller if firmware hangs or deadlocks", isCorrect: true },
          { id: "o3", text: "Save battery during deep sleep mode", isCorrect: false },
          { id: "o4", text: "Monitor serial communication packet errors", isCorrect: false }
        ]
      },
      {
        id: "s3",
        orderIndex: 2,
        type: "word_cloud",
        title: "In one word, what is your favorite microcontroller / development board?",
        description: "e.g., ESP32, STM32, Arduino, RaspberryPi, PIC, 8051",
        settings: { maxEntriesPerUser: 3 }
      },
      {
        id: "s4",
        orderIndex: 3,
        type: "multiple_choice",
        title: "Which communication protocol uses only 2 wires for synchronous serial data?",
        description: "SDA (Serial Data) and SCL (Serial Clock)",
        options: [
          { id: "o1", text: "SPI (Serial Peripheral Interface)", isCorrect: false },
          { id: "o2", text: "I2C (Inter-Integrated Circuit)", isCorrect: true },
          { id: "o3", text: "UART (Universal Asynchronous)", isCorrect: false },
          { id: "o4", text: "CAN Bus (Controller Area Network)", isCorrect: false }
        ]
      },
      {
        id: "s5",
        orderIndex: 4,
        type: "qa",
        title: "Live Q&A: Ask questions about Embedded Systems careers & projects!",
        description: "Upvote your peers' questions for the EMBEDX coordinator."
      }
    ]
  },
  {
    id: "template-electronics-fundamentals",
    title: "Electronics Fundamentals & Circuitry",
    description: "Interactive session covering Ohm's law, op-amps, semiconductors, and digital logic.",
    category: "Academics & Core EEE",
    coverColor: "from-cyan-600 to-teal-900",
    slides: [
      {
        id: "s1",
        orderIndex: 0,
        type: "multiple_choice",
        title: "What happens to the resistance of an NTC Thermistor as temperature increases?",
        description: "Negative Temperature Coefficient sensor behavior.",
        options: [
          { id: "o1", text: "Resistance Increases", isCorrect: false },
          { id: "o2", text: "Resistance Decreases", isCorrect: true },
          { id: "o3", text: "Resistance Remains Constant", isCorrect: false },
          { id: "o4", text: "Resistance Oscillates", isCorrect: false }
        ]
      },
      {
        id: "s2",
        orderIndex: 1,
        type: "true_false",
        title: "An ideal operational amplifier (Op-Amp) has infinite input impedance and zero output impedance.",
        description: "Theoretical Op-Amp golden rules.",
        options: [
          { id: "o1", text: "True", isCorrect: true },
          { id: "o2", text: "False", isCorrect: false }
        ]
      },
      {
        id: "s3",
        orderIndex: 2,
        type: "quiz",
        title: "What is the equivalent resistance of two 100-Ohm resistors connected in parallel?",
        description: "Calculate quickly for speed bonus!",
        timerSeconds: 15,
        points: 1000,
        speedBonus: true,
        options: [
          { id: "o1", text: "200 Ohms", isCorrect: false },
          { id: "o2", text: "100 Ohms", isCorrect: false },
          { id: "o3", text: "50 Ohms", isCorrect: true },
          { id: "o4", text: "25 Ohms", isCorrect: false }
        ]
      },
      {
        id: "s4",
        orderIndex: 3,
        type: "rating_scale",
        title: "How comfortable are you with breadboarding and circuit debugging?",
        description: "Rate your confidence level from 1 (Novice) to 5 (Master)",
        settings: { min: 1, max: 5, minLabel: "Need Practice", maxLabel: "Pro Wizard" }
      }
    ]
  },
  {
    id: "template-microcontroller-challenge",
    title: "Microcontroller & Architecture Challenge",
    description: "Deep dive into 8051, AVR ATmega328P, STM32 ARM Cortex-M, and PIC microcontrollers.",
    category: "Hardware Engineering",
    coverColor: "from-purple-600 to-indigo-950",
    slides: [
      {
        id: "s1",
        orderIndex: 0,
        type: "quiz",
        title: "What is the size of the Program Counter in the classic 8051 microcontroller?",
        description: "Addressing memory range check.",
        timerSeconds: 20,
        points: 1000,
        speedBonus: true,
        options: [
          { id: "o1", text: "8-bit", isCorrect: false },
          { id: "o2", text: "16-bit", isCorrect: true },
          { id: "o3", text: "32-bit", isCorrect: false },
          { id: "o4", text: "64-bit", isCorrect: false }
        ]
      },
      {
        id: "s2",
        orderIndex: 1,
        type: "ranking",
        title: "Rank these microcontrollers by processing capability (Lowest to Highest):",
        description: "Order them from entry-level to high-performance",
        options: [
          { id: "o1", text: "Classic Intel 8051 (8-bit)" },
          { id: "o2", text: "ATmega328P Arduino Uno (8-bit @ 16MHz)" },
          { id: "o3", text: "ESP32 Dual-Core Xtensa (32-bit @ 240MHz)" },
          { id: "o4", text: "STM32F4 ARM Cortex-M4 (32-bit with FPU)" }
        ]
      },
      {
        id: "s3",
        orderIndex: 2,
        type: "open_ended",
        title: "What was the most challenging microcontroller bug you ever encountered?",
        description: "Share your debugging battle stories with the club!"
      }
    ]
  },
  {
    id: "template-arduino-esp32",
    title: "Arduino & ESP32 IoT Live Poll",
    description: "Wi-Fi, Bluetooth, FreeRTOS, MQTT, and smart hardware interfacing.",
    category: "IoT & Wireless",
    coverColor: "from-emerald-600 to-teal-950",
    slides: [
      {
        id: "s1",
        orderIndex: 0,
        type: "multiple_choice",
        title: "Which protocol is the lightweight de-facto standard for IoT sensor telemetry?",
        description: "Publish/Subscribe protocol over TCP/IP.",
        options: [
          { id: "o1", text: "HTTP REST API", isCorrect: false },
          { id: "o2", text: "MQTT (Message Queuing Telemetry Transport)", isCorrect: true },
          { id: "o3", text: "FTP (File Transfer Protocol)", isCorrect: false },
          { id: "o4", text: "SNMP (Simple Network Management)", isCorrect: false }
        ]
      },
      {
        id: "s2",
        orderIndex: 1,
        type: "word_cloud",
        title: "What IoT sensors have you worked with recently?",
        description: "e.g., DHT11, MPU6050, Ultrasonic, BMP280, PIR, LoadCell"
      },
      {
        id: "s3",
        orderIndex: 2,
        type: "quiz",
        title: "Does ESP32 include native FreeRTOS out of the box in ESP-IDF?",
        description: "Real-Time Operating System kernel.",
        timerSeconds: 15,
        points: 1000,
        speedBonus: true,
        options: [
          { id: "o1", text: "Yes, dual-core preemptive FreeRTOS", isCorrect: true },
          { id: "o2", text: "No, FreeRTOS must be manually flashed via JTAG", isCorrect: false },
          { id: "o3", text: "Only on ESP8266, not on ESP32", isCorrect: false },
          { id: "o4", text: "FreeRTOS only runs on Raspberry Pi", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "template-robotics-automation",
    title: "Robotics & Autonomous Rovers Challenge",
    description: "Differential drive kinematics, motor drivers, PID control, and sensor fusion.",
    category: "Robotics & Automation",
    coverColor: "from-amber-600 to-red-950",
    slides: [
      {
        id: "s1",
        orderIndex: 0,
        type: "multiple_choice",
        title: "What type of H-Bridge driver is typically used for dual DC motor speed and direction control?",
        description: "Common IC in robotics workshops.",
        options: [
          { id: "o1", text: "L298N / L293D", isCorrect: true },
          { id: "o2", text: "NE555 Timer", isCorrect: false },
          { id: "o3", text: "LM7805 Voltage Regulator", isCorrect: false },
          { id: "o4", text: "MAX232 Level Converter", isCorrect: false }
        ]
      },
      {
        id: "s2",
        orderIndex: 1,
        type: "quiz",
        title: "In a PID controller for line-following rovers, which term eliminates steady-state error?",
        description: "Proportional, Integral, or Derivative?",
        timerSeconds: 20,
        points: 1000,
        speedBonus: true,
        options: [
          { id: "o1", text: "Proportional (P)", isCorrect: false },
          { id: "o2", text: "Integral (I)", isCorrect: true },
          { id: "o3", text: "Derivative (D)", isCorrect: false },
          { id: "o4", text: "Feed-Forward", isCorrect: false }
        ]
      },
      {
        id: "s3",
        orderIndex: 2,
        type: "rating_scale",
        title: "How interested are you in joining the EMBEDX Autonomous Rover Design Team?",
        description: "1 = Just curious, 5 = Ready to build hardware today!",
        settings: { min: 1, max: 5 }
      }
    ]
  },
  {
    id: "template-workshop-feedback",
    title: "EMBEDX Workshop Hands-on Feedback",
    description: "Comprehensive feedback survey to collect participant sentiment and suggestions.",
    category: "Club Feedback",
    coverColor: "from-sky-600 to-blue-950",
    slides: [
      {
        id: "s1",
        orderIndex: 0,
        type: "rating_scale",
        title: "Overall, how would you rate today's hands-on workshop session?",
        description: "1 (Poor) to 5 (Exceptional)",
        settings: { min: 1, max: 5 }
      },
      {
        id: "s2",
        orderIndex: 1,
        type: "multiple_choice",
        title: "Which aspect of the workshop was most valuable to you?",
        description: "Select your primary takeaway",
        options: [
          { id: "o1", text: "Hardware Circuit Debugging & Breadboarding" },
          { id: "o2", text: "Live Embedded Firmware Coding" },
          { id: "o3", text: "Peer Collaboration & Team Problem-Solving" },
          { id: "o4", text: "Instructor Demonstrations & Mentorship" }
        ]
      },
      {
        id: "s3",
        orderIndex: 2,
        type: "word_cloud",
        title: "Describe today's workshop experience in 3 words:",
        description: "Share your instant impressions"
      },
      {
        id: "s4",
        orderIndex: 3,
        type: "open_ended",
        title: "What topics would you like EMBEDX to cover in our next technical seminar?",
        description: "PCB Design, ROS2, TinyML, FPGA, Industrial PLC, etc."
      }
    ]
  },
  {
    id: "template-embednova-symposium",
    title: "EMBEDNOVA National Symposium Engagement",
    description: "Audience icebreaker and live technical voting for the annual national symposium.",
    category: "Symposium & Events",
    coverColor: "from-fuchsia-600 to-indigo-950",
    slides: [
      {
        id: "s1",
        orderIndex: 0,
        type: "word_cloud",
        title: "Welcome to EMBEDNOVA! Where are you joining us from?",
        description: "Enter your college, department, or home city!"
      },
      {
        id: "s2",
        orderIndex: 1,
        type: "multiple_choice",
        title: "Which technical competition track are you participating in today?",
        description: "Vote to see live competitor distribution!",
        options: [
          { id: "o1", text: "Robo-War / Autonomous Rover Grand Prix" },
          { id: "o2", text: "Circuit Debugging & Hardware Speed Run" },
          { id: "o3", text: "IoT Smart Campus Hackathon" },
          { id: "o4", text: "Paper Presentation & Innovation Showcase" }
        ]
      },
      {
        id: "s3",
        orderIndex: 2,
        type: "qa",
        title: "Questions for the Chief Guest & Keynote Speakers",
        description: "Submit and upvote questions during the keynote address."
      }
    ]
  },
  {
    id: "template-eee-orientation",
    title: "EEE Department Technical Orientation",
    description: "Welcome first and second year students to Electrical & Electronics Engineering.",
    category: "Orientation & Induction",
    coverColor: "from-cyan-700 to-slate-900",
    slides: [
      {
        id: "s1",
        orderIndex: 0,
        type: "word_cloud",
        title: "What sparked your interest in Electrical & Electronics Engineering?",
        description: "Robots, Electric Vehicles, Renewable Energy, Chips, Automation..."
      },
      {
        id: "s2",
        orderIndex: 1,
        type: "ranking",
        title: "Which engineering domain excites you the most?",
        description: "Rank them in order of personal curiosity",
        options: [
          { id: "o1", text: "Electric Vehicles (EV) & Battery Management Systems" },
          { id: "o2", text: "Embedded Systems, Microcontrollers & Robotics" },
          { id: "o3", text: "Smart Grid, Solar & Renewable Power Systems" },
          { id: "o4", text: "Industrial Automation, PLC & SCADA" }
        ]
      },
      {
        id: "s3",
        orderIndex: 2,
        type: "multiple_choice",
        title: "Have you ever coded a microcontroller or built an electronic circuit before?",
        options: [
          { id: "o1", text: "Yes, built several school/hobby projects!" },
          { id: "o2", text: "Tried an Arduino or simple LED circuit once" },
          { id: "o3", text: "Total beginner – eager to learn everything in EMBEDX!" }
        ]
      }
    ]
  },
  {
    id: "template-iot-smart-automation",
    title: "IoT & Smart Automation Awareness Poll",
    description: "Industry 4.0, smart home gadgets, edge AI, and industrial automation standards.",
    category: "Industry 4.0",
    coverColor: "from-violet-600 to-slate-950",
    slides: [
      {
        id: "s1",
        orderIndex: 0,
        type: "multiple_choice",
        title: "Which wireless standard offers ultra-low power mesh networking for home automation?",
        description: "Standard IEEE 802.15.4 based protocol.",
        options: [
          { id: "o1", text: "Zigbee / Matter", isCorrect: true },
          { id: "o2", text: "NFC (Near Field Communication)", isCorrect: false },
          { id: "o3", text: "5G Ultra-Wideband", isCorrect: false },
          { id: "o4", text: "Classic Bluetooth Audio", isCorrect: false }
        ]
      },
      {
        id: "s2",
        orderIndex: 1,
        type: "word_cloud",
        title: "What smart automation device do you use daily?",
        description: "e.g., Smart bulb, Alexa, Smart watch, Automated pump, Thermostat"
      },
      {
        id: "s3",
        orderIndex: 2,
        type: "survey",
        title: "Campus Smart Automation Needs Survey",
        description: "Help prioritize EMBEDX student automation initiatives for SRM TRP campus."
      }
    ]
  },
  {
    id: "template-circuit-debugging",
    title: "Hardware Circuit Debugging Competition",
    description: "Speed quiz on multimeter usage, oscilloscope waveforms, solder bridging, and logic states.",
    category: "Technical Competition",
    coverColor: "from-rose-600 to-amber-950",
    slides: [
      {
        id: "s1",
        orderIndex: 0,
        type: "quiz",
        title: "When an oscilloscope probe is set to 10X attenuation, what does it do to the input signal?",
        description: "Critical measurement principle.",
        timerSeconds: 15,
        points: 1000,
        speedBonus: true,
        options: [
          { id: "o1", text: "Divides voltage by 10 and increases input impedance", isCorrect: true },
          { id: "o2", text: "Multiplies voltage by 10 for weak signals", isCorrect: false },
          { id: "o3", text: "Limits frequency bandwidth to 10MHz", isCorrect: false },
          { id: "o4", text: "Filters out DC voltage offset completely", isCorrect: false }
        ]
      },
      {
        id: "s2",
        orderIndex: 1,
        type: "quiz",
        title: "What happens if you measure voltage while the multimeter test leads are in the '10A Current' jack?",
        description: "Safety and circuit protection question.",
        timerSeconds: 15,
        points: 1000,
        speedBonus: true,
        options: [
          { id: "o1", text: "Creates a direct short circuit and blows the fuse", isCorrect: true },
          { id: "o2", text: "Accurately measures voltage with higher precision", isCorrect: false },
          { id: "o3", text: "Nothing, the meter auto-senses voltage", isCorrect: false },
          { id: "o4", text: "Inverts the measured polarity", isCorrect: false }
        ]
      },
      {
        id: "s3",
        orderIndex: 2,
        type: "true_false",
        title: "A floating input pin on a CMOS microcontroller logic gate can cause erratic oscillations and high power consumption.",
        options: [
          { id: "o1", text: "True (Always use pull-up / pull-down resistors)", isCorrect: true },
          { id: "o2", text: "False", isCorrect: false }
        ]
      }
    ]
  }
];

