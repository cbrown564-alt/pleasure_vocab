// Research Explainers for Pleasure Vocabulary Builder
// Accessible science summaries explaining the research behind the content

import { ResearchExplainer } from '@/types';

export const explainers: ResearchExplainer[] = [
  {
    id: 'orgasm-gap',
    title: 'The Orgasm Gap',
    subtitle: 'Why it exists and what actually closes it',
    icon: 'stats-chart',
    readTime: '6 min read',

    overview:
      'In heterosexual encounters, women orgasm significantly less often than men—but this gap nearly disappears in same-sex encounters. Research shows this isn\'t about biology; it\'s about what happens during sex. Understanding the gap is the first step to closing it.',

    keyTakeaways: [
      'Heterosexual women orgasm 65% of the time vs 95% for men—but lesbian women reach 86%',
      'The gap is behavioral, not biological: it\'s about what activities occur during sex',
      'Only 18% of women orgasm from penetration alone; most need clitoral stimulation',
      'Communication about preferences correlates strongly (r=.43) with satisfaction',
      'Women who ask for what they want report significantly higher orgasm rates',
    ],

    sections: [
      {
        title: 'What Is the Orgasm Gap?',
        content: `The "orgasm gap" refers to the consistent finding that in heterosexual partnered encounters, women orgasm significantly less frequently than men. This disparity has been documented across multiple large-scale studies and appears consistently across age groups and relationship types.

A landmark study of over 52,000 adults found that heterosexual men reported orgasming 95% of the time during partnered sexual encounters, while heterosexual women reported orgasming only 65% of the time. This 30-percentage-point gap represents a substantial and persistent inequality in sexual outcomes.

Importantly, the gap is much smaller in same-sex encounters. Lesbian women reported orgasming 86% of the time—demonstrating that this isn't about women's bodies being "harder to please" but about what happens during different types of sexual encounters.`,
        statistic: {
          value: '65% vs 95%',
          label: 'Women vs men orgasm rate in heterosexual encounters',
          source: 'Frederick et al., 2018 (N=52,588)',
        },
      },
      {
        title: 'Why Does the Gap Exist?',
        content: `The gap is not biological—research clearly demonstrates that women have equal physiological capacity for orgasm. Instead, the gap emerges from behavioral patterns: specifically, what activities are prioritized during heterosexual encounters versus same-sex encounters.

The primary factor is clitoral stimulation. Research consistently shows that only about 18% of women can orgasm from vaginal penetration alone, yet penetration remains the primary focus of many heterosexual encounters. In contrast, same-sex encounters between women tend to include more direct clitoral stimulation.

Cultural scripts about sex—particularly the idea that penetration is the "main event"—contribute to this pattern. When sex is defined as penis-in-vagina intercourse, activities that are more reliably pleasurable for women may be treated as optional extras rather than central components.`,
        statistic: {
          value: '18%',
          label: 'Women who can orgasm from penetration alone',
          source: 'Research synthesis',
        },
      },
      {
        title: 'What Closes the Gap?',
        content: `Research has identified specific factors that predict higher orgasm rates for women in heterosexual encounters. The most significant is receiving adequate clitoral stimulation—whether from hands, mouth, toys, or positioning that creates contact during penetration.

Variety matters too. Women who receive multiple types of stimulation (oral sex, manual stimulation, and penetration) in the same encounter report significantly higher orgasm rates than those receiving only one type. One study found an 86% orgasm rate when all three were included.

Communication is equally crucial. Studies show a strong correlation between sexual communication and satisfaction. Women who communicate about their preferences—what feels good, what they'd like more of, what they'd like to try—report better outcomes. This includes in-the-moment guidance as well as conversations outside the bedroom.`,
        statistic: {
          value: '86%',
          label: 'Orgasm rate with oral + manual + penetration combined',
          source: 'Frederick et al., 2018',
        },
      },
      {
        title: 'What This Means for You',
        content: `Understanding the orgasm gap reframes the conversation: if you've ever felt that something was "wrong" with you because orgasm didn't come easily during partnered sex, the research suggests it's not you—it's the script you've been handed.

This knowledge is empowering. If the gap is behavioral rather than biological, it can be addressed through behavior change: incorporating more of what works (clitoral stimulation, variety, communication), and less adherence to scripts that prioritize activities less likely to produce pleasure.

Building vocabulary for your preferences—knowing the words for what you like and how to express them—is a concrete step toward closing your personal orgasm gap. The concepts in this app are tools for that project.`,
      },
    ],

    misconceptions: [
      {
        myth: 'Women are just harder to please than men',
        fact: 'Women have equal physiological capacity for orgasm. The gap exists because of behavioral patterns, not biology. When sexual activities include adequate clitoral stimulation, the gap nearly disappears.',
      },
      {
        myth: 'Vaginal orgasms are more "mature" or superior',
        fact: 'There\'s no hierarchy of orgasms. Most women need clitoral stimulation to orgasm, and this is normal anatomy, not a deficiency. The clitoris exists for pleasure.',
      },
      {
        myth: 'If orgasm doesn\'t happen easily, something is wrong',
        fact: 'Orgasm during partnered sex often requires specific conditions: adequate arousal time, the right kind of stimulation, and mental presence. These are learnable skills, not innate abilities.',
      },
    ],

    keySources: [
      {
        citation: 'Frederick, D. A., et al. (2018). Archives of Sexual Behavior, 47(1), 273-288.',
        finding: 'Study of 52,588 adults documenting the orgasm gap across sexual orientations and identifying behavioral correlates of women\'s orgasm.',
      },
      {
        citation: 'Herbenick, D., et al. (2018). Archives of Sexual Behavior, 47(8), 2379-2390.',
        finding: 'Found that the combination of genital stimulation, oral sex, and deep kissing best predicted women\'s orgasm during partnered sex.',
      },
      {
        citation: 'Shirazi, T., et al. (2018). Archives of Sexual Behavior, 47(5), 1321-1333.',
        finding: 'Meta-analysis confirming that clitoral stimulation is the most reliable route to orgasm for most women.',
      },
      {
        citation: 'Mallory, A. B. (2022). Journal of Sex Research, meta-analysis.',
        finding: 'Found sexual communication correlates r=.43 with sexual satisfaction, with effects stronger for women than men.',
      },
    ],

    relatedConceptIds: ['pairing', 'golden-trio', 'warmup-window', 'responsive-desire'],
    relatedExplainerIds: ['anatomy-101', 'communication-science'],
    tier: 'free',
  },

  {
    id: 'anatomy-101',
    title: 'Anatomy 101',
    subtitle: 'The clitoris is bigger than you think',
    icon: 'body',
    readTime: '5 min read',

    overview:
      'For centuries, female genital anatomy was poorly understood and rarely studied. Modern imaging has revealed that the clitoris is a much larger organ than previously recognized—mostly internal, richly innervated, and central to understanding pleasure.',

    keyTakeaways: [
      'The clitoris is approximately 9cm in total size, with most of the structure internal',
      'The external glans contains over 8,000 nerve endings—roughly equal to the entire penis',
      'Internal clitoral tissue wraps around the vaginal canal, explaining internal sensitivity',
      'The "G-spot" is likely internal clitoral stimulation through the vaginal wall',
      'Understanding anatomy helps explain why certain techniques and positions feel different',
    ],

    sections: [
      {
        title: 'More Than Meets the Eye',
        content: `What's visible of the clitoris—the glans and clitoral hood—represents only a fraction of the full organ. Modern MRI studies have mapped the complete clitoral structure, revealing it to be approximately 9cm in total size, with internal legs (crura) and vestibular bulbs extending inside the body.

The crura are two elongated structures that extend backward from the glans along the pubic bone. The vestibular bulbs are erectile tissue that flank the vaginal opening and fill with blood during arousal, contributing to the sensation of engorgement.

This internal structure wraps around the vaginal canal, which explains why some internal stimulation feels pleasurable—pressure on the vaginal walls can affect the surrounding clitoral tissue. Understanding this anatomy reframes many aspects of sexual pleasure.`,
        statistic: {
          value: '~9cm',
          label: 'Total size of the clitoral organ including internal tissue',
          source: 'O\'Connell et al., 2005',
        },
      },
      {
        title: 'Understanding Sensitivity',
        content: `The clitoral glans—the external, visible portion—contains over 8,000 nerve endings. This is approximately equal to the number found in the entire penis, but concentrated in a much smaller area. This density explains the glans' exquisite sensitivity.

Because of this concentration, direct stimulation of the glans can sometimes feel too intense, particularly before adequate arousal. Many women prefer indirect stimulation through the hood, or stimulation of the surrounding area rather than the glans directly. Sensitivity also varies with arousal level—what feels like too much early on may feel perfect later.

The high nerve density also explains why small differences in technique can produce very different sensations. Slight changes in pressure, speed, or angle can significantly alter the experience. This is why having specific vocabulary for preferences matters—there's a lot of nuance to communicate.`,
        statistic: {
          value: '8,000+',
          label: 'Nerve endings in the clitoral glans',
          source: 'Anatomical research',
        },
      },
      {
        title: 'The "G-Spot" Explained',
        content: `The "G-spot" has been debated for decades, but modern anatomical understanding offers clarification. The sensitive area on the anterior (front) vaginal wall—typically 1-3 inches inside, toward the belly button—corresponds to where internal clitoral tissue and the urethral sponge can be felt through the vaginal lining.

Researchers now refer to this integrated area as the clitourethrovaginal (CUV) complex. Stimulation of this area affects multiple sensitive structures simultaneously: internal clitoral tissue, the urethra (surrounded by nerve-rich tissue), and the vaginal wall itself.

This explains why there's no single "spot" that works for everyone—the anatomy varies between individuals, and responsiveness can change with arousal level. Rather than searching for a magic button, it's more helpful to explore the general area and notice what feels pleasurable.`,
      },
      {
        title: 'Why This Matters',
        content: `Understanding clitoral anatomy has practical implications. It explains why external stimulation is important for most women's pleasure and orgasm—you're accessing the most nerve-dense part of a larger organ. It explains why positions and techniques that create clitoral contact often feel better.

It also explains internal pleasure. Techniques like angling (tilting the pelvis to change where penetration creates pressure) work because they optimize contact with internal clitoral tissue. The "G-spot" isn't separate from the clitoris—it's another way to access it.

This anatomical knowledge can help with exploration and communication. Instead of thinking something is wrong if penetration alone isn't enough, you can recognize that you're working with anatomy that's designed for multi-point stimulation.`,
      },
    ],

    misconceptions: [
      {
        myth: 'The clitoris is just a small external bump',
        fact: 'The visible portion is just the tip. The full clitoral structure is approximately 9cm and extends internally, wrapping around the vaginal canal.',
      },
      {
        myth: 'The G-spot is a separate organ from the clitoris',
        fact: 'The sensitive anterior vaginal wall corresponds to internal clitoral tissue. G-spot stimulation is often indirect clitoral stimulation through the vaginal wall.',
      },
      {
        myth: 'Vaginal and clitoral orgasms are completely different',
        fact: 'Given the anatomical overlap (internal clitoral tissue surrounds the vagina), many "vaginal" orgasms likely involve clitoral stimulation—just accessed internally rather than externally.',
      },
    ],

    keySources: [
      {
        citation: 'O\'Connell, H. E., et al. (2005). Journal of Urology, 174(4), 1189-1195.',
        finding: 'MRI imaging study mapping the full clitoral structure, revealing its 9cm size and internal components.',
      },
      {
        citation: 'Foldes, P., & Buisson, O. (2009). Journal of Sexual Medicine, 6(5), 1223-1231.',
        finding: 'Ultrasound study showing how the clitoris moves and engorges during arousal and stimulation.',
      },
      {
        citation: 'Jannini, E. A., et al. (2014). Nature Reviews Urology, 11(9), 531-538.',
        finding: 'Review describing the clitourethrovaginal complex and its role in female sexual response.',
      },
    ],

    relatedConceptIds: ['clitoral-structure', 'nerve-density', 'clitourethrovaginal', 'internal-stimulation'],
    relatedExplainerIds: ['orgasm-gap'],
    tier: 'free',
  },

  {
    id: 'mind-body',
    title: 'The Mind-Body Connection',
    subtitle: 'Why your brain matters as much as your body',
    icon: 'bulb',
    readTime: '6 min read',

    overview:
      'Sexual response isn\'t purely physical—your brain plays a central role in arousal and pleasure. Research shows that mental factors like attention, presence, and self-evaluation significantly impact sexual experience. Understanding these patterns opens new avenues for enhancing pleasure.',

    keyTakeaways: [
      'Spectatoring (mentally watching yourself during sex) interferes with arousal and pleasure',
      'Embodied presence—focused attention on sensation—enhances sexual experience',
      'Non-concordance (when physical signs don\'t match how turned on you feel) is normal',
      'Mindfulness-based approaches significantly improve sexual satisfaction',
      'Where you direct your attention during sex matters as much as what\'s happening physically',
    ],

    sections: [
      {
        title: 'Your Brain During Sex',
        content: `Sexual arousal involves a complex interplay between body and brain. Physical stimulation sends signals to the brain, but the brain's interpretation of those signals—influenced by attention, emotions, thoughts, and context—shapes the experience of pleasure.

Attention is particularly crucial. When attention is focused on bodily sensations, pleasure tends to be enhanced. When attention is diverted—to worries, self-evaluation, or distractions—the same physical stimulation may produce less pleasure or none at all.

This is why sex can feel completely different depending on your mental state. The same touch that feels electric when you're relaxed and present might barely register when you're stressed or distracted. Understanding this gives you a lever for enhancing pleasure that doesn't require any change to physical technique.`,
      },
      {
        title: 'Spectatoring: The Arousal Killer',
        content: `"Spectatoring" is a term coined by pioneering sex researchers Masters and Johnson to describe a common barrier to sexual enjoyment: mentally stepping outside yourself to observe and evaluate your own performance during sex.

When you're spectatoring, you're not fully in the experience—you're watching yourself as if from the outside, often running critical commentary. "Do I look okay? Am I taking too long? Is my partner getting bored? Am I doing this right?" This self-focused attention pulls cognitive resources away from processing pleasure.

Research confirms that spectatoring correlates with lower arousal, reduced pleasure, and increased sexual difficulties. The good news is that spectatoring is a mental habit, not a fixed trait. With practice, it's possible to notice when you've slipped into observer mode and gently redirect attention back to sensation.`,
      },
      {
        title: 'Presence Over Performance',
        content: `The antidote to spectatoring is embodied presence: focused, non-judgmental attention on the physical sensations you're experiencing in the moment. Rather than thinking about sex, you're feeling it.

Mindfulness-based interventions have shown significant promise for improving sexual function and satisfaction. Research by Dr. Lori Brotto and colleagues has demonstrated that mindfulness training helps women with arousal difficulties by teaching them to redirect attention from anxious thoughts to bodily sensations.

Cultivating presence doesn't mean trying to force your mind to be blank. It means noticing when your attention has wandered (to evaluation, worries, or distractions) and gently returning it to what you're actually feeling. What does this touch feel like right now? Where in your body do you notice sensation? This simple redirection can significantly enhance pleasure.`,
        statistic: {
          value: 'Significant improvement',
          label: 'Sexual satisfaction after mindfulness training',
          source: 'Brotto, 2018',
        },
      },
      {
        title: 'When Body and Mind Disagree',
        content: `"Non-concordance" refers to the common experience of disconnect between physical arousal signs (like lubrication or genital blood flow) and the subjective feeling of being turned on. Your body might show physical signs of arousal when you don't feel interested, or you might feel very mentally aroused while your body isn't visibly responding.

Research shows that for women, there's only about a 10-25% overlap between genital response and subjective arousal. This is strikingly different from men, where the correlation is much higher. Non-concordance is now understood as normal female sexual response, not a dysfunction.

This has important implications. Physical response alone doesn't indicate desire or consent. And lack of visible physical response doesn't mean you're not aroused or that something is wrong. Your felt sense of arousal—how turned on you actually feel—is what matters, regardless of what your body appears to be doing.`,
        statistic: {
          value: '10-25%',
          label: 'Overlap between physical and subjective arousal in women',
          source: 'Chivers et al., 2010',
        },
      },
    ],

    misconceptions: [
      {
        myth: 'Physical arousal signs mean you\'re turned on',
        fact: 'Non-concordance is common—bodies can respond to sexually relevant stimuli without subjective arousal. Only you know if you\'re actually turned on; physical signs aren\'t reliable indicators.',
      },
      {
        myth: 'Being present during sex should come naturally',
        fact: 'Focused attention is a skill that can be developed. Most people\'s minds wander during sex; learning to redirect attention to sensation is a practice, not an innate ability.',
      },
      {
        myth: 'Thinking about pleasure helps you experience more of it',
        fact: 'Often the opposite is true. Thinking about pleasure (evaluation, performance) can pull you out of actually feeling it. Sensation-focused attention tends to work better than thought-focused attention.',
      },
    ],

    keySources: [
      {
        citation: 'Masters, W. H., & Johnson, V. E. (1970). Human Sexual Inadequacy.',
        finding: 'Introduced the concept of "spectatoring" as a barrier to sexual response and satisfaction.',
      },
      {
        citation: 'Brotto, L. A. (2018). Better Sex Through Mindfulness. Greystone Books.',
        finding: 'Reviews research showing mindfulness-based interventions improve arousal, desire, and satisfaction.',
      },
      {
        citation: 'Chivers, M. L., et al. (2010). Archives of Sexual Behavior, 39(1), 5-56.',
        finding: 'Meta-analysis finding low correlation (10%) between genital response and subjective arousal in women.',
      },
      {
        citation: 'Barlow, D. H. (1986). American Psychologist, 41(2), 140-148.',
        finding: 'Research on how self-focused attention interferes with sexual arousal.',
      },
    ],

    relatedConceptIds: ['spectatoring', 'embodied-presence', 'non-concordance', 'body-appreciation', 'sexual-self-esteem'],
    relatedExplainerIds: ['communication-science'],
    tier: 'free',
  },

  {
    id: 'communication-science',
    title: 'Communication Science',
    subtitle: 'Why asking for what you want works',
    icon: 'chatbubbles',
    readTime: '5 min read',

    overview:
      'Research consistently shows that sexual communication is one of the strongest predictors of sexual satisfaction—yet many people find it difficult. Understanding why communication works and what holds us back can help bridge the gap between knowing what you want and being able to ask for it.',

    keyTakeaways: [
      'Sexual communication correlates r=.43 with sexual satisfaction (a strong effect)',
      'Over half of women (55%) want to communicate about sex but choose not to',
      'Fear of hurting partner\'s feelings is the most common barrier (42%)',
      'Women who ask for what they want report significantly higher orgasm rates',
      'Partners generally respond more positively than people expect',
    ],

    sections: [
      {
        title: 'The Research Is Clear',
        content: `The relationship between sexual communication and sexual satisfaction is one of the most robust findings in sex research. A comprehensive meta-analysis found a correlation of r=.43 between communication about sex and sexual satisfaction—a strong effect in psychological research.

This relationship appears across different types of communication: talking about preferences, giving in-the-moment feedback, discussing what feels good, and expressing desires. All forms of sexual communication are associated with better outcomes.

Importantly, the effect is even stronger for women than for men. This makes sense given the orgasm gap—if women's pleasure requires activities and attention that aren't always automatically included, communication becomes essential for ensuring those needs are met.`,
        statistic: {
          value: 'r = .43',
          label: 'Correlation between communication and satisfaction',
          source: 'Mallory, 2022 meta-analysis',
        },
      },
      {
        title: 'Why We Stay Silent',
        content: `Despite knowing that communication helps, many people don't communicate about sex. Research has mapped the specific barriers people report:

Fear of hurting their partner's feelings is the most common barrier, cited by 42% of people. Many worry that expressing a preference implies criticism of what their partner is currently doing. Discomfort with explicit discussion comes second at 40%—even in intimate relationships, talking explicitly about sex can feel more vulnerable than having it.

Embarrassment about desires (38%) and worry about seeming demanding (35%) round out the top barriers. These fears often overestimate the negative reaction partners will have. Studies show that partners typically respond more positively to sexual communication than people predict.`,
        statistic: {
          value: '55%',
          label: 'Of women want to communicate but decide not to',
          source: 'Herbenick et al., 2019',
        },
      },
      {
        title: 'What Works',
        content: `Research on effective sexual communication points to several principles. Framing preferences positively ("I love when you...") tends to be received better than negative framing ("Don't do..."). Specific guidance ("a little slower" or "right there") is more useful than vague statements.

Timing matters too. Some conversations are better outside the bedroom—discussing new things to try, addressing patterns, or sharing what you've learned about yourself. Other communication works best in the moment—guiding pressure, speed, or location of touch.

Having vocabulary helps enormously. When you can name what you want—using terms like "angling" or "pairing" or "more warm-up time"—communication becomes more precise and less awkward. This is one of the core goals of building a pleasure vocabulary.`,
      },
      {
        title: 'From Knowledge to Practice',
        content: `Knowing that communication works is different from actually doing it. The gap between intention and action is where many people get stuck. Some practical bridges:

Start small. You don't have to have a big vulnerable conversation to begin communicating. Simple in-the-moment guidance ("that feels good" or "a little softer") builds both your confidence and your partner's responsiveness.

Use tools. The Communication Toolkit in this app provides scripts and starters—model language you can adapt. Sometimes having the words ready makes it easier to speak.

Remember the research. Partners typically respond better than people fear. And even if a conversation feels awkward, the outcome is usually worth it. Temporary discomfort for lasting improvement is a worthwhile trade.`,
      },
    ],

    misconceptions: [
      {
        myth: 'Good partners should just know what you want',
        fact: 'Even the most attentive partner can\'t read your mind. Bodies differ, preferences differ, and what you want may change. Communication is always necessary—it\'s not a sign of inadequacy.',
      },
      {
        myth: 'Asking for what you want ruins the mood',
        fact: 'Research shows the opposite: communication enhances satisfaction. Guidance helps your partner succeed, which benefits both of you. Brief, clear communication can be seamlessly integrated.',
      },
      {
        myth: 'Being direct means being demanding or critical',
        fact: 'Expressing preferences is an act of trust and intimacy, not criticism. Partners generally appreciate knowing what feels good—it takes the guesswork out of pleasing you.',
      },
    ],

    keySources: [
      {
        citation: 'Mallory, A. B. (2022). Journal of Sex Research, meta-analysis.',
        finding: 'Meta-analysis finding r=.43 correlation between sexual communication and satisfaction, with stronger effects for women.',
      },
      {
        citation: 'Herbenick, D., et al. (2019). PLOS ONE.',
        finding: 'Survey finding 55% of women want to communicate about sex but decide not to, with barriers including fear of hurting feelings.',
      },
      {
        citation: 'Frederick, D. A., et al. (2017). Journal of Sex Research.',
        finding: 'Women who ask for what they want during sex report significantly higher orgasm frequency.',
      },
      {
        citation: 'MacNeil, S., & Byers, E. S. (2009). Journal of Sex Research.',
        finding: 'Research on self-disclosure in sexual relationships showing positive outcomes from vulnerability.',
      },
    ],

    relatedConceptIds: ['responsive-desire', 'warmup-window', 'spectatoring'],
    relatedExplainerIds: ['orgasm-gap', 'mind-body'],
    tier: 'free',
  },
];

// Helper functions
export function getExplainerById(id: string): ResearchExplainer | undefined {
  return explainers.find((e) => e.id === id);
}

export function getExplainersForConcept(conceptId: string): ResearchExplainer[] {
  return explainers.filter((e) => e.relatedConceptIds.includes(conceptId));
}

export function getAllExplainers(): ResearchExplainer[] {
  return explainers;
}
