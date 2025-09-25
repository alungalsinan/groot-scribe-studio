import aiArticleImage from '@/assets/ai-article.jpg';
import quantumArticleImage from '@/assets/quantum-article.jpg';

export interface Article {
  id: string;
  title: string;
  summary: string;
  author: string;
  readingTime: number;
  publishedAt: string;
  category: string;
  imageUrl?: string;
  featured?: boolean;
  content?: string;
}

export interface Issue {
  id: string;
  title: string;
  month: string;
  year: number;
  coverImage: string;
  description: string;
  publishedAt: string;
}

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Rise of Neural Interfaces: When Thoughts Become Code',
    summary: 'Breakthrough advances in brain-computer interfaces are revolutionizing how we interact with technology. From paralyzed patients controlling robotic arms to healthy individuals typing with their minds, we explore the cutting-edge research that\'s making science fiction reality.',
    author: 'Dr. Sarah Chen',
    readingTime: 8,
    publishedAt: '2025-09-22',
    category: 'Neurotechnology',
    imageUrl: aiArticleImage,
    featured: true,
    content: `# The Rise of Neural Interfaces: When Thoughts Become Code

The boundary between human consciousness and digital technology is dissolving. In laboratories around the world, researchers are developing brain-computer interfaces (BCIs) that can translate neural signals directly into digital commands, opening unprecedented possibilities for human enhancement and medical treatment.

## The Current State of Neural Interfaces

Recent breakthroughs have moved BCIs from experimental concepts to practical applications. Companies like Neuralink, Kernel, and traditional medical device manufacturers are racing to develop safe, effective neural interface technologies.

### Medical Applications

The most immediate applications focus on restoring function to patients with neurological conditions:

- **Motor Control**: Paralyzed patients can now control robotic limbs with thought alone
- **Communication**: Locked-in syndrome patients can type by thinking about letters
- **Sensory Restoration**: Early trials suggest BCIs could restore sight to the blind

### Consumer Applications

Beyond medical applications, researchers envision BCIs that could enhance normal human capabilities:

- **Thought-Based Computing**: Controlling computers without keyboards or mice
- **Memory Enhancement**: External storage and retrieval of memories
- **Direct Neural Communication**: Brain-to-brain information transfer

## Technical Challenges

Despite exciting progress, significant challenges remain:

### Signal Processing
Neural signals are incredibly complex and noisy. Current systems can only decode simple intentions, and the algorithms require extensive training for each individual user.

### Invasiveness
Most effective BCIs require surgical implantation of electrodes directly into brain tissue, raising safety concerns and limiting adoption.

### Privacy and Security
Direct access to neural data raises unprecedented privacy concerns. How do we protect the most intimate thoughts and experiences?

## The Road Ahead

The next decade promises dramatic advances in neural interface technology. As our understanding of the brain deepens and technology becomes less invasive, we may see the emergence of the first truly seamless human-computer integration.

The implications extend far beyond technology—they touch on fundamental questions about human identity, privacy, and the nature of consciousness itself.

*Dr. Sarah Chen is a neuroscientist and bioengineering professor at Stanford University, specializing in brain-computer interface research.*`
  },
  {
    id: '2',
    title: 'Quantum Computing Breakthrough: IBM\'s 1000-Qubit Milestone',
    summary: 'IBM has achieved a major milestone in quantum computing with their new 1000-qubit processor. We examine what this means for cryptography, drug discovery, and the future of computation.',
    author: 'Prof. Michael Rodriguez',
    readingTime: 6,
    publishedAt: '2025-09-20',
    category: 'Quantum Computing',
    imageUrl: quantumArticleImage,
    content: `# Quantum Computing Breakthrough: IBM's 1000-Qubit Milestone

IBM has announced a groundbreaking achievement in quantum computing: the successful development of a 1000-qubit quantum processor. This milestone represents a significant leap forward in our ability to harness quantum mechanics for computational purposes.

## Understanding Quantum Supremacy

Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or "qubits" that can exist in multiple states simultaneously through quantum superposition. This allows quantum computers to perform certain calculations exponentially faster than classical computers.

### The Significance of 1000 Qubits

Previous quantum computers operated with dozens or hundreds of qubits. The jump to 1000 qubits represents a crucial threshold where quantum computers begin to solve problems that are practically impossible for classical computers.

## Real-World Applications

### Cryptography
Current encryption methods rely on the difficulty of factoring large numbers. Quantum computers could break these encryption schemes, but they could also enable quantum-safe cryptography.

### Drug Discovery
Quantum computers excel at simulating molecular interactions, potentially accelerating the discovery of new medicines and materials.

### Financial Modeling
Complex financial models involving numerous variables could be solved more efficiently with quantum processors.

## Technical Challenges Overcome

### Error Correction
Quantum states are extremely fragile and prone to errors. IBM's achievement includes significant advances in quantum error correction, making reliable computation possible.

### Coherence Time
Maintaining quantum states long enough to perform useful calculations has been a major challenge. The new processor maintains coherence for unprecedented durations.

## What's Next?

This breakthrough brings us closer to fault-tolerant quantum computing—systems that can run for extended periods without errors. The next goals include:

- Scaling to 10,000+ qubits
- Improving error rates
- Developing quantum algorithms for practical problems

The quantum revolution is no longer a question of "if" but "when."

*Prof. Michael Rodriguez leads the Quantum Information Science program at MIT.*`
  },
  {
    id: '3',
    title: 'CRISPR 3.0: The Next Generation of Gene Editing',
    summary: 'New advances in CRISPR technology promise more precise, safer gene editing with applications ranging from treating genetic diseases to enhancing crop yields.',
    author: 'Dr. Lisa Park',
    readingTime: 7,
    publishedAt: '2025-09-18',
    category: 'Biotechnology',
    content: `# CRISPR 3.0: The Next Generation of Gene Editing

The gene editing revolution continues with the development of CRISPR 3.0, a new generation of molecular tools that promise unprecedented precision in modifying DNA. These advances could transform medicine, agriculture, and our understanding of life itself.

## Evolution of CRISPR Technology

Since its discovery, CRISPR-Cas9 has evolved rapidly:

### CRISPR 1.0: Basic Gene Editing
The original system allowed scientists to cut DNA at specific locations, enabling gene knockout and basic modifications.

### CRISPR 2.0: Enhanced Precision
Improved versions introduced base editing and prime editing, allowing for more precise modifications without creating double-strand breaks.

### CRISPR 3.0: Programmable Biology
The latest generation introduces multi-gene editing, temporal control, and the ability to make complex, coordinated changes across the genome.

## Key Innovations

### Miniaturized Systems
New CRISPR variants are small enough to be delivered efficiently to cells throughout the body, expanding therapeutic possibilities.

### Reduced Off-Target Effects
Advanced guide RNA design and improved Cas proteins dramatically reduce unintended edits, making the technology safer for human use.

### Epigenetic Editing
Beyond changing DNA sequences, CRISPR 3.0 can modify gene expression patterns without altering the underlying genetic code.

## Medical Applications

### Genetic Diseases
Clinical trials are underway for treating conditions like sickle cell disease, muscular dystrophy, and inherited blindness.

### Cancer Therapy
Engineered immune cells with enhanced tumor-fighting capabilities are showing promising results in early trials.

### Organ Transplantation
Genetically modified pig organs could solve the organ shortage crisis while reducing rejection risks.

## Agricultural Revolution

### Climate-Resilient Crops
CRISPR is being used to develop crops that can withstand drought, extreme temperatures, and changing growing conditions.

### Enhanced Nutrition
Biofortified crops with increased vitamin content could address malnutrition in developing countries.

### Reduced Pesticide Use
Crops with natural pest resistance could reduce the environmental impact of agriculture.

## Ethical Considerations

The power of CRISPR 3.0 raises important ethical questions:

- Should we edit human embryos to prevent genetic diseases?
- How do we ensure equitable access to gene therapies?
- What are the long-term consequences of widespread genetic modifications?

## The Future of Gene Editing

As CRISPR technology continues to advance, we're approaching a future where genetic diseases become curable, crops are perfectly adapted to their environments, and the boundaries of biology become increasingly programmable.

The next decade will likely see the first generation of children born free from inherited diseases, ushering in a new era of human health and longevity.

*Dr. Lisa Park is a molecular biologist and gene therapy researcher at Harvard Medical School.*`
  },
  {
    id: '4',
    title: 'Fusion Energy: The Race to Unlimited Clean Power',
    summary: 'Private companies and government labs are competing to achieve the holy grail of energy: controlled nuclear fusion that produces more energy than it consumes.',
    author: 'Dr. James Wilson',
    readingTime: 9,
    publishedAt: '2025-09-15',
    category: 'Energy',
  },
  {
    id: '5',
    title: 'The Metaverse Economy: Virtual Real Estate and Digital Assets',
    summary: 'As virtual worlds mature, a new economy is emerging where digital assets, virtual real estate, and cryptocurrency create unprecedented opportunities.',
    author: 'Sarah Johnson',
    readingTime: 5,
    publishedAt: '2025-09-12',
    category: 'Technology',
  },
];

export const mockIssues: Issue[] = [
  {
    id: 'current',
    title: 'The AI Revolution',
    month: 'September',
    year: 2025,
    coverImage: '/images/covers/sept-2025.jpg',
    description: 'Exploring the transformative impact of artificial intelligence across industries, from healthcare to transportation.',
    publishedAt: '2025-09-01',
  },
  {
    id: '2',
    title: 'Quantum Leap',
    month: 'August',
    year: 2025,
    coverImage: '/images/covers/aug-2025.jpg',
    description: 'The quantum computing revolution and its implications for cryptography, simulation, and problem-solving.',
    publishedAt: '2025-08-01',
  },
  {
    id: '3',
    title: 'Climate Tech Solutions',
    month: 'July',
    year: 2025,
    coverImage: '/images/covers/jul-2025.jpg',
    description: 'Innovative technologies fighting climate change, from carbon capture to renewable energy breakthroughs.',
    publishedAt: '2025-07-01',
  },
];

export const mockCategories = [
  { id: '1', name: 'Artificial Intelligence', count: 15 },
  { id: '2', name: 'Quantum Computing', count: 8 },
  { id: '3', name: 'Biotechnology', count: 12 },
  { id: '4', name: 'Energy', count: 6 },
  { id: '5', name: 'Space Technology', count: 9 },
  { id: '6', name: 'Neurotechnology', count: 4 },
];