// Vocabulary content for Pleasure Vocabulary Builder
// Based on research from Hensel et al., 2021 (PLOS ONE)

import { Concept } from '@/types';
import { getPathwayById } from './pathways';

export const concepts: Concept[] = [
  {
    id: 'angling',
    name: 'Angling',
    category: 'technique',
    definition:
      'Rotating, raising, or lowering the pelvis during penetration to adjust where internal stimulation occurs.',
    description: `Angling involves making subtle adjustments to pelvic position during penetrative activity. By tilting, raising, or lowering your pelvis, you can change the angle of penetration to target different areas of internal sensation.

Many people discover this technique intuitively - you might notice yourself naturally shifting position to find an angle that feels better. Naming this movement makes it easier to recognize when you're doing it and to communicate about it.

The adjustment can be small - even a slight change in pelvic tilt can shift sensations significantly. Some find certain angles consistently feel better, while others enjoy varying the angle throughout an experience.`,
    researchBasis:
      'Identified in the OMGyes Pleasure Report research as one of four named techniques associated with enhanced pleasure. The research found that having language for this movement helped women recognize and replicate what works for them.',
    source: 'Hensel et al., 2021, PLOS ONE',
    recognitionPrompts: [
      'Have you ever noticed yourself tilting your hips to change how something feels?',
      'Do certain positions feel better because of the angle they create?',
      'Have you found yourself adjusting your body position to intensify or change sensations?',
    ],
    relatedConcepts: ['rocking', 'pairing'],
    tier: 'free',
  },
  {
    id: 'rocking',
    name: 'Rocking',
    category: 'technique',
    definition:
      'A grinding or rocking motion that keeps consistent contact with external areas during penetration.',
    description: `Rocking refers to a grinding, circular, or back-and-forth motion during penetrative activity that maintains continuous contact between bodies - particularly at the point where external sensitive areas meet a partner's body.

Unlike thrusting motions that create movement in and out, rocking keeps bodies close together with a rhythmic motion that provides consistent external stimulation alongside any internal sensations.

This technique can be particularly relevant because it allows for simultaneous internal and external stimulation without needing hands. The motion comes from the hips and pelvis, creating a wave-like or circular movement rather than linear motion.`,
    researchBasis:
      'Research shows that consistent external stimulation is important for pleasure for many women. Rocking was identified as a specific named technique that facilitates this during partnered penetrative activity.',
    source: 'Hensel et al., 2021, PLOS ONE',
    recognitionPrompts: [
      'Have you noticed a difference between grinding/rocking motions versus thrusting?',
      'Do you find that staying close and moving rhythmically feels different than more separated movement?',
      'Have you experienced how certain motions maintain more consistent contact with sensitive areas?',
    ],
    relatedConcepts: ['angling', 'pairing'],
    tier: 'free',
  },
  {
    id: 'shallowing',
    name: 'Shallowing',
    category: 'technique',
    definition:
      'Focusing stimulation at or just inside the vaginal entrance rather than deeper penetration.',
    description: `Shallowing describes pleasurable touch that focuses on the vaginal entrance and the area just inside - using fingertips, tongue, or the tip of a toy or partner rather than deeper penetration.

The entrance area has a high concentration of nerve endings, and many people find stimulation here to be particularly sensitive and pleasurable. Shallowing treats this area as a destination rather than just a passage to somewhere else.

This technique can involve gentle circling, light pressure, teasing movements, or simply pausing to appreciate sensations in this area. It reframes shallow penetration as intentional and pleasurable rather than incomplete.`,
    researchBasis:
      'The vaginal entrance (introitus) contains a high density of nerve endings. Research identified shallowing as a distinct technique that many women find pleasurable, challenging assumptions that deeper always means better.',
    source: 'Hensel et al., 2021, PLOS ONE',
    recognitionPrompts: [
      'Have you noticed that the entrance area can feel especially sensitive?',
      'Do you sometimes enjoy the beginning moments of penetration most?',
      'Have you experienced pleasure from gentle, shallow touch rather than deeper stimulation?',
    ],
    relatedConcepts: ['pairing'],
    tier: 'free',
  },
  {
    id: 'pairing',
    name: 'Pairing',
    category: 'technique',
    definition:
      'Adding external clitoral stimulation during penetration, either solo or with a partner.',
    description: `Pairing means combining internal penetration with external clitoral stimulation - using your own hand, a partner's hand, a toy, or body positioning to add external touch during penetrative activity.

This technique directly addresses what research consistently shows: most women need clitoral stimulation for orgasm, and penetration alone often doesn't provide sufficient clitoral contact. Pairing treats this not as a problem but as useful information about how bodies work.

Pairing can happen in many ways - reaching down yourself, guiding a partner's hand, using a small vibrator, or choosing positions that naturally create external contact. The key insight is that adding this stimulation is normal, common, and makes physiological sense.`,
    researchBasis:
      'Extensive research shows that the clitoris, not the vagina, is the primary site of orgasmic sensation for most women. Studies find that adding clitoral stimulation during penetration significantly increases likelihood of orgasm.',
    source: 'Hensel et al., 2021, PLOS ONE; Frederick et al., 2018',
    recognitionPrompts: [
      'Do you find that penetration feels better when combined with external touch?',
      'Have you added your own touch during partnered experiences?',
      'Do you notice a difference in intensity when both internal and external stimulation happen together?',
    ],
    relatedConcepts: ['angling', 'rocking', 'shallowing'],
    tier: 'free',
  },

  // ============ SENSATIONS & QUALITIES ============
  {
    id: 'building',
    name: 'Building',
    category: 'sensation',
    definition:
      'A gradual increase in arousal intensity over time, like a wave gathering strength.',
    description: `Building describes the experience of arousal intensifying progressively - not jumping immediately to peak sensation, but allowing pleasure to accumulate and deepen over time.

This sensation often feels like something is gathering momentum. It might start as a subtle warmth or tingling, then gradually become more pronounced, more focused, more insistent. The building phase is often where anticipation and actual sensation blend together.

Understanding building as a named experience helps recognize that arousal doesn't need to be instant or linear. Some people find that rushing through this phase diminishes the eventual peak, while allowing building to unfold naturally leads to more intense experiences.`,
    researchBasis:
      'Research on sexual response cycles identifies arousal building as a distinct phase. Studies show that extended arousal periods often correlate with more satisfying experiences and stronger orgasms.',
    source: 'Masters & Johnson; Basson, 2000',
    recognitionPrompts: [
      'Have you noticed pleasure intensifying gradually rather than all at once?',
      'Do you experience a gathering or accumulating quality to arousal?',
      'Have you found that taking time to let sensations build leads to different outcomes?',
    ],
    relatedConcepts: ['plateauing', 'edging', 'warmup-window'],
    tier: 'free',
  },
  {
    id: 'plateauing',
    name: 'Plateauing',
    category: 'sensation',
    definition:
      'Sustained arousal at a consistent level without increase - a holding pattern that may precede orgasm or signal a need for change.',
    description: `Plateauing is the experience of arousal staying at a steady level - neither building toward climax nor fading. It's like reaching a landing on a staircase and staying there for a while.

This can happen for different reasons. Sometimes plateauing is a natural pause before orgasm, a moment of hovering at high arousal. Other times, it signals that what's happening isn't quite leading where you want to go - perhaps something needs to shift, change pace, or add new stimulation.

Recognizing a plateau helps you respond to it intentionally. You might choose to savor the sustained pleasure, or you might use it as information that it's time to try something different.`,
    researchBasis:
      'Sexual response research identifies a plateau phase as common in arousal cycles. Understanding this phase helps differentiate between a natural pause and a signal that stimulation needs adjustment.',
    source: 'Masters & Johnson sexual response cycle',
    recognitionPrompts: [
      'Have you noticed arousal leveling off at a consistent intensity?',
      'Do you sometimes reach a point where pleasure is steady but not increasing?',
      'Have you experienced moments of "hovering" at high arousal before orgasm?',
    ],
    relatedConcepts: ['building', 'edging'],
    tier: 'free',
  },
  {
    id: 'edging',
    name: 'Edging',
    category: 'sensation',
    definition:
      'Intentionally approaching the edge of orgasm, then easing back before it happens - often repeated multiple times.',
    description: `Edging is the practice of bringing yourself (or being brought) close to orgasm, then deliberately pausing or slowing to pull back from the edge. This cycle of approaching and retreating can be repeated multiple times.

Some people practice edging to extend the duration of pleasurable sensations, finding that prolonged arousal is satisfying in itself. Others find that edging leads to more intense eventual orgasms, as the repeated buildup seems to amplify the release.

Edging requires body awareness - learning to recognize your own signs of approaching orgasm in time to pause. It's also a form of intentional control over sexual experience, turning what might feel like a race to the finish line into a more exploratory journey.`,
    researchBasis:
      'Studies on orgasm intensity suggest that delayed orgasm following extended arousal often feels more powerful. Edging is also studied as a technique for orgasm control and sexual mindfulness.',
    source: 'Research on orgasm delay and intensity',
    recognitionPrompts: [
      'Have you ever intentionally paused right before orgasm to prolong the experience?',
      'Do you notice that delayed orgasms sometimes feel more intense?',
      'Have you explored the sensations of being close to the edge without going over?',
    ],
    relatedConcepts: ['building', 'plateauing', 'embodied-presence'],
    tier: 'free',
  },
  {
    id: 'spreading',
    name: 'Spreading',
    category: 'sensation',
    definition:
      'The sensation of arousal radiating outward from its origin point through the body.',
    description: `Spreading describes how pleasure can expand beyond the area being stimulated - radiating outward like ripples in water. What starts as localized sensation might flow through the pelvis, up the spine, through the limbs, or across the whole body.

This spreading quality often distinguishes full-body arousal from purely genital sensation. Some people experience spreading as warmth, others as tingling, electricity, or waves of sensation that travel through different body regions.

Noticing spreading can enhance the experience of pleasure by expanding attention beyond the point of touch. It's also useful information about your body's arousal patterns - some people find that spreading sensations indicate deep relaxation and full engagement.`,
    researchBasis:
      'Research on embodied sexuality notes that awareness of whole-body sensation often correlates with more satisfying sexual experiences. Spreading relates to concepts of body-wide arousal versus localized stimulation.',
    source: 'Embodied sexuality research; sensate focus studies',
    recognitionPrompts: [
      'Have you noticed pleasure traveling from one area through other parts of your body?',
      'Do you experience tingling, warmth, or waves that spread beyond the point of stimulation?',
      'Have you felt arousal in areas that aren\'t being directly touched?',
    ],
    relatedConcepts: ['building', 'pulsing', 'embodied-presence'],
    tier: 'free',
  },
  {
    id: 'pulsing',
    name: 'Pulsing',
    category: 'sensation',
    definition:
      'Rhythmic, wave-like sensations during high arousal or orgasm - a beating or throbbing quality.',
    description: `Pulsing refers to the rhythmic quality that pleasure can take on - a beating, throbbing, or wave-like pattern. This is especially noticeable during orgasm, when muscle contractions create literal pulses, but pulsing sensations can occur throughout arousal.

During high arousal, you might notice a pulse-like quality to genital sensation, possibly synchronized with heartbeat. During orgasm, rhythmic contractions of pelvic muscles create distinct pulsing that many people experience as waves of pleasure.

Having language for this sensation helps recognize it when it's happening, and helps communicate about preferences - some people particularly enjoy stimulation that matches or plays with this natural pulsing rhythm.`,
    researchBasis:
      'Orgasm research documents rhythmic pelvic muscle contractions occurring approximately every 0.8 seconds during orgasm. Many people report subjective experiences that correspond to these physical rhythms.',
    source: 'Meston & Buss, 2009; physiology of orgasm research',
    recognitionPrompts: [
      'Have you noticed a rhythmic, beating quality to arousal or orgasm?',
      'Do you experience waves or pulses of sensation during high arousal?',
      'Have you felt throbbing or rhythmic contractions during orgasm?',
    ],
    relatedConcepts: ['building', 'spreading'],
    tier: 'free',
  },

  // ============ TIMING & PACING ============
  {
    id: 'warmup-window',
    name: 'Warm-up Window',
    category: 'timing',
    definition:
      'The time needed for whole-body arousal before genital-focused stimulation feels best - often 20+ minutes.',
    description: `The warm-up window refers to the period of time many bodies need for full arousal before genital-focused stimulation becomes most pleasurable. This isn't a problem or delay - it's how arousal often works, particularly for vulva-owners.

Research suggests that for many women, blood flow to genital tissue, natural lubrication, and full-body arousal take approximately 20-45 minutes of stimulation to reach their peak. Jumping directly to genital touch before this warm-up can feel less pleasurable or even uncomfortable.

Understanding the warm-up window reframes extended foreplay not as a requirement or obligation, but as recognizing how your body reaches full arousal. It's useful information for solo experiences and for communicating with partners about pacing.`,
    researchBasis:
      'Studies on genital blood flow and arousal timing show significant gender differences. Research indicates that adequate warm-up time correlates with better lubrication, comfort, and reported pleasure.',
    source: 'Chivers et al., 2010; arousal timing research',
    recognitionPrompts: [
      'Do you find that touch feels better after you\'ve had time to get warmed up?',
      'Have you noticed that rushing can make stimulation feel less enjoyable?',
      'Does your body seem to have its own timeline for getting fully aroused?',
    ],
    relatedConcepts: ['building', 'responsive-desire'],
    tier: 'free',
  },
  {
    id: 'responsive-desire',
    name: 'Responsive Desire',
    category: 'timing',
    definition:
      'Sexual interest that arises in response to stimulation or erotic context, rather than appearing spontaneously beforehand.',
    description: `Responsive desire describes a pattern where sexual interest emerges in response to something - a partner's initiation, an erotic situation, or physical stimulation that's already begun - rather than arising spontaneously as an internal urge.

This is an extremely common pattern, especially for women in long-term relationships. Research suggests that responsive desire is just as valid and healthy as spontaneous desire - it's simply a different pathway to the same destination.

Understanding responsive desire can be liberating. It means you don't need to "feel like it" beforehand to enjoy sex. Many people with responsive desire find that once things start and they get into the experience, desire and arousal build naturally. The absence of spontaneous desire isn't a problem to fix.`,
    researchBasis:
      'Dr. Emily Nagoski\'s synthesis of desire research highlights responsive desire as a normal, common pattern. Studies show responsive desire is particularly common for women and doesn\'t indicate low libido.',
    source: 'Nagoski, 2015; Basson circular model of desire',
    recognitionPrompts: [
      'Do you rarely feel spontaneous urges for sex, but enjoy it once you get started?',
      'Does your desire seem to show up after physical touch or kissing begins?',
      'Have you felt like something must be wrong because you don\'t often think about wanting sex?',
    ],
    relatedConcepts: ['spontaneous-desire', 'warmup-window'],
    tier: 'free',
  },
  {
    id: 'spontaneous-desire',
    name: 'Spontaneous Desire',
    category: 'timing',
    definition:
      'Sexual interest that arises on its own, without an external trigger - a seemingly random urge for sexual activity.',
    description: `Spontaneous desire is sexual interest that appears to come from nowhere - an internal urge or wanting that arises without an obvious external stimulus. This is what people typically think of as "being in the mood" or "feeling horny."

While often portrayed as the normal or ideal form of desire, spontaneous desire is actually just one of two common patterns. It tends to be more common in men and in the early stages of relationships, becoming less frequent over time for many people.

Understanding spontaneous desire as one pattern among others helps remove the expectation that it should always be present. People experience different mixes of spontaneous and responsive desire, and this can vary with life circumstances, stress, relationship stage, and other factors.`,
    researchBasis:
      'Research distinguishes between spontaneous and responsive desire patterns. Studies show that spontaneous desire is more common in men but occurs in all genders, and often decreases in frequency during long-term relationships.',
    source: 'Basson, 2000; desire research',
    recognitionPrompts: [
      'Do you sometimes feel sexually interested without any obvious cause?',
      'Have you experienced random urges or thoughts about wanting sex?',
      'Does desire ever seem to appear out of nowhere?',
    ],
    relatedConcepts: ['responsive-desire'],
    tier: 'free',
  },
  {
    id: 'golden-trio',
    name: 'Golden Trio',
    category: 'timing',
    definition:
      'Combining intercourse with manual and oral stimulation - a combination associated with 86% orgasm rates in research.',
    description: `The Golden Trio refers to a specific combination of activities that research has found particularly effective for women's orgasms: vaginal intercourse combined with manual stimulation combined with oral sex (in the same session, not necessarily simultaneously).

In a large study of women's sexual experiences, those who received all three types of stimulation reported an 86% orgasm rate - significantly higher than any single activity alone or pairs of activities. This isn't prescriptive - it's information about what statistically tends to work.

The takeaway isn't that everyone should do exactly this combination, but rather that variety and multiple forms of stimulation often serve pleasure better than a singular focus. The Golden Trio also implicitly acknowledges that penetration alone rarely produces orgasm for women.`,
    researchBasis:
      'Frederick et al. (2018) found that women who received genital stimulation, oral sex, and deep kissing in addition to vaginal intercourse reported the highest rates of orgasm during partnered sex.',
    source: 'Frederick et al., 2018, Archives of Sexual Behavior',
    recognitionPrompts: [
      'Have you noticed that combining different types of touch leads to different experiences?',
      'Do you find that variety in a sexual encounter affects your likelihood of orgasm?',
      'Has adding oral or manual stimulation to penetration changed your experience?',
    ],
    relatedConcepts: ['pairing', 'warmup-window'],
    tier: 'free',
  },

  // ============ PSYCHOLOGICAL FACTORS ============
  {
    id: 'spectatoring',
    name: 'Spectatoring',
    category: 'psychological',
    definition:
      'Mentally watching and evaluating yourself during sex rather than staying present in the experience.',
    description: `Spectatoring is the experience of mentally stepping outside yourself during sex to observe and judge what's happening - focusing on how you look, whether you're responding "correctly," how long it's taking, or what your partner might be thinking.

This self-observation pulls attention away from physical sensations and into anxious self-monitoring. Instead of feeling what's happening, you're watching yourself and running mental commentary: "Am I taking too long? Do I look okay? Should I be more into this?"

Spectatoring is common but interferes with arousal and pleasure. The good news is that it can be addressed - techniques from mindfulness and sex therapy can help redirect attention back to bodily sensations and present-moment experience.`,
    researchBasis:
      'Masters and Johnson identified spectatoring as a common barrier to sexual enjoyment. Research shows that self-focused attention during sex correlates with lower arousal, reduced pleasure, and increased sexual difficulties.',
    source: 'Masters & Johnson; Barlow, 1986',
    recognitionPrompts: [
      'Do you sometimes find yourself watching yourself during sex as if from the outside?',
      'Have you been pulled out of the moment by thoughts about how you look or perform?',
      'Do you notice running mental commentary during sex instead of just feeling?',
    ],
    relatedConcepts: ['embodied-presence', 'sexual-self-esteem'],
    tier: 'free',
  },
  {
    id: 'embodied-presence',
    name: 'Embodied Presence',
    category: 'psychological',
    definition:
      'Focused attention on bodily sensations during intimacy - being fully in your body rather than in your head.',
    description: `Embodied presence is the opposite of spectatoring - it's being fully in your body and present to sensations rather than caught up in thoughts, judgments, or mental chatter. It's what happens when you're so absorbed in feeling that thinking temporarily fades.

This isn't about forcing your mind to be blank, but about gently returning attention to physical sensation whenever you notice it has wandered. What does this touch actually feel like? What sensations are present right now? Where in my body do I feel pleasure?

Cultivating embodied presence can significantly enhance sexual experience. When attention is fully on sensation, pleasure typically intensifies. Mindfulness practices outside the bedroom can strengthen this capacity over time.`,
    researchBasis:
      'Mindfulness-based interventions for sexual difficulties show significant improvements in arousal and satisfaction. Research links present-focused attention during sex to better outcomes across multiple measures.',
    source: 'Brotto, 2018; mindfulness and sexuality research',
    recognitionPrompts: [
      'Have you experienced moments of being completely absorbed in physical sensation?',
      'Do you notice a difference in pleasure when you\'re fully present versus distracted?',
      'Have you tried bringing your attention back to sensation when your mind wanders?',
    ],
    relatedConcepts: ['spectatoring', 'body-appreciation'],
    tier: 'free',
  },
  {
    id: 'non-concordance',
    name: 'Non-concordance',
    category: 'psychological',
    definition:
      'When physical arousal signs (lubrication, erection) don\'t match the subjective feeling of being turned on - and vice versa.',
    description: `Non-concordance is the disconnect that can occur between physical arousal signals and how turned on you actually feel. Your body might show signs of arousal while you don't feel interested, or you might feel very mentally aroused while your body isn't responding visibly.

This is extremely common - research shows only about a 10-25% overlap between physical and subjective arousal for women. Physical response doesn't equal desire, and lack of visible response doesn't mean absence of interest. Bodies respond to sexually relevant stimuli, whether or not we're actually aroused.

Understanding non-concordance is liberating. It means you can trust your felt experience of arousal rather than judging by physical signs alone. It also means physical signs don't indicate consent or desire - only explicit communication does.`,
    researchBasis:
      'Chivers et al. meta-analysis found low correlation between genital response and subjective arousal in women (~10%). This non-concordance is now understood as normal rather than dysfunctional.',
    source: 'Chivers et al., 2010; Nagoski, 2015',
    recognitionPrompts: [
      'Have you ever felt turned on without your body showing typical signs of arousal?',
      'Has your body responded physically to something that didn\'t actually interest you?',
      'Have you experienced disconnect between how aroused you felt and what your body was doing?',
    ],
    relatedConcepts: ['responsive-desire', 'embodied-presence'],
    tier: 'free',
  },
  {
    id: 'sexual-self-esteem',
    name: 'Sexual Self-Esteem',
    category: 'psychological',
    definition:
      'A positive self-concept around sexuality - feeling good about yourself as a sexual person.',
    description: `Sexual self-esteem is how you feel about yourself as a sexual being - whether you view your sexuality positively, feel confident in your desirability, and have a healthy relationship with your own sexual self.

Higher sexual self-esteem is associated with better sexual outcomes: more pleasure, more orgasms, more communication with partners, and more satisfaction. This makes sense - feeling good about your sexuality creates conditions for enjoying it more fully.

Sexual self-esteem can be affected by many factors: upbringing, past experiences, body image, relationship history, cultural messages. The good news is that it can be developed - through positive experiences, self-exploration, challenging negative beliefs, and building sexual self-knowledge.`,
    researchBasis:
      'Research consistently links sexual self-esteem to sexual satisfaction and function. Studies show it predicts orgasm frequency, arousal, and relationship satisfaction.',
    source: 'Sexuality research; self-esteem and outcomes studies',
    recognitionPrompts: [
      'How do you generally feel about yourself as a sexual person?',
      'Do you feel confident in your sexuality and desirability?',
      'Have negative feelings about your sexuality held you back from pleasure or communication?',
    ],
    relatedConcepts: ['body-appreciation', 'spectatoring'],
    tier: 'free',
  },
  {
    id: 'body-appreciation',
    name: 'Body Appreciation',
    category: 'psychological',
    definition:
      'Valuing your body for what it does and feels rather than evaluating its appearance.',
    description: `Body appreciation is the practice of relating to your body based on sensation, function, and experience rather than visual evaluation. It's appreciating what your body feels, does, and allows you to experience, rather than how it looks.

During sexual experiences, body appreciation means staying with how things feel rather than worrying about how you look. It means appreciating your body's capacity for sensation rather than critiquing its appearance. This shift in orientation supports greater pleasure.

Body appreciation isn't about thinking your body is perfect or ignoring appearance entirely - it's about not letting appearance concerns interfere with sensory experience. Research shows this orientation correlates with better sexual outcomes.`,
    researchBasis:
      'Studies link body appreciation and positive body image to better sexual satisfaction. Women who focus on body function versus appearance during sex report more orgasms and less distraction.',
    source: 'Body image and sexuality research; Satinsky et al., 2012',
    recognitionPrompts: [
      'During sex, are you more focused on how your body looks or how it feels?',
      'Can you appreciate what your body does and feels, separate from appearance?',
      'Do appearance concerns pull you out of sensory experience during intimacy?',
    ],
    relatedConcepts: ['embodied-presence', 'sexual-self-esteem', 'spectatoring'],
    tier: 'free',
  },

  // ============ ANATOMY UNDERSTANDING ============
  {
    id: 'clitoral-structure',
    name: 'Clitoral Structure',
    category: 'anatomy',
    definition:
      'The full clitoral organ is approximately 9cm in size, with internal legs (crura) and bulbs extending inside the body.',
    description: `The clitoris is much larger than it appears from the outside. What's visible - the glans and hood - is just the tip of an organ that extends about 9cm internally, with legs (crura) that wrap around the vaginal canal and erectile bulbs that fill with blood during arousal.

Understanding this internal structure reframes anatomy. The "G-spot" area is actually where internal clitoral tissue can be stimulated through the vaginal wall. Much of what we call vaginal pleasure involves indirect clitoral stimulation.

This anatomical reality explains why external stimulation is important for most women's pleasure and orgasm - the clitoris is the primary pleasure organ, and its visible portion is just the most accessible part of a larger structure.`,
    researchBasis:
      'MRI imaging studies have mapped the full clitoral structure, revealing it to be approximately 9cm including internal tissue. This research transformed understanding of female genital anatomy.',
    source: 'O\'Connell et al., 2005; clitoral anatomy research',
    recognitionPrompts: [
      'Did you know the clitoris extends internally beyond what\'s visible?',
      'Have you thought about how internal sensations might relate to clitoral structure?',
      'Does understanding this anatomy change how you think about pleasure?',
    ],
    relatedConcepts: ['nerve-density', 'clitourethrovaginal', 'internal-stimulation'],
    tier: 'free',
  },
  {
    id: 'nerve-density',
    name: 'Nerve Density',
    category: 'anatomy',
    definition:
      'The clitoral glans contains over 8,000 nerve endings - approximately equal to the entire penis.',
    description: `The clitoral glans (the visible external portion) contains more than 8,000 nerve endings - a remarkable concentration in a structure much smaller than the penis, which has approximately the same number spread across a larger area.

This density of nerve endings makes the clitoral glans extremely sensitive. This is why direct, intense stimulation of the glans can sometimes feel like too much, while the right kind of touch can produce intense pleasure. Sensitivity varies individually and can change with arousal level.

Understanding nerve density helps explain why clitoral stimulation is central to most women's orgasms - this is where the highest concentration of pleasure-sensing nerves exists. It's also why touch approach matters so much - all those nerves respond to subtleties of pressure, rhythm, and technique.`,
    researchBasis:
      'Anatomical studies have counted approximately 8,000 nerve endings in the clitoral glans. This exceeds nerve density in almost any other body part of similar size.',
    source: 'Clitoral anatomy research; O\'Connell et al.',
    recognitionPrompts: [
      'Have you noticed how sensitive the clitoral area is to different types of touch?',
      'Does knowing about this concentration of nerves inform your understanding of pleasure?',
      'Have you experienced how the same area can feel too sensitive or just right depending on approach?',
    ],
    relatedConcepts: ['clitoral-structure', 'pairing'],
    tier: 'free',
  },
  {
    id: 'clitourethrovaginal',
    name: 'CUV Complex',
    category: 'anatomy',
    definition:
      'The integrated tissue cluster where clitoris, urethra, and anterior vaginal wall interact - explaining "G-spot" sensitivity.',
    description: `The clitourethrovaginal (CUV) complex describes how the clitoris, urethra, and front vaginal wall are interconnected rather than separate structures. This tissue cluster explains the sensitivity of the area often called the "G-spot."

When the front wall of the vagina feels particularly sensitive, it's because pressure there affects the internal portions of the clitoris and the urethra - all richly supplied with nerves. There isn't a distinct "spot" so much as an area where multiple sensitive structures can be stimulated together.

Understanding the CUV complex resolves debates about whether the G-spot "exists." The sensitivity is real, but it's explained by anatomy rather than a mysterious separate organ. This integrated understanding helps explore what actually feels good rather than searching for a magic button.`,
    researchBasis:
      'Anatomical imaging and dissection studies show the clitoris, urethra, and vaginal wall form an integrated complex. Stimulation of one component affects the others.',
    source: 'Jannini et al., 2014; anatomical imaging studies',
    recognitionPrompts: [
      'Have you experienced sensitivity on the front wall of the vagina?',
      'Does understanding how these structures connect change your view of internal pleasure?',
      'Have you explored how different angles or pressures affect sensation in this area?',
    ],
    relatedConcepts: ['clitoral-structure', 'internal-stimulation'],
    tier: 'free',
  },
  {
    id: 'internal-stimulation',
    name: 'Internal Clitoral Stimulation',
    category: 'anatomy',
    definition:
      'Stimulating internal clitoral tissue through the vaginal wall - what\'s often called "G-spot" sensation.',
    description: `Internal clitoral stimulation refers to reaching the internal portions of the clitoris through the vaginal wall. The area of sensitivity on the front vaginal wall (toward the belly button) is where internal clitoral tissue and the urethral sponge can be felt through the vaginal lining.

This reframes "vaginal orgasm" - rather than a completely different type of orgasm, internal stimulation is often still clitoral stimulation, just accessed differently. The sensations may feel distinct from external touch because different portions of the structure are being stimulated.

Techniques like angling and certain positions work because they optimize contact with this anterior wall area. Understanding this helps with intentional exploration rather than hoping to accidentally find the right spot.`,
    researchBasis:
      'Studies suggest that vaginal orgasms likely involve internal clitoral stimulation. The anterior vaginal wall\'s sensitivity corresponds to underlying clitoral and urethral tissue.',
    source: 'Foldes & Buisson, 2009; G-spot research',
    recognitionPrompts: [
      'Have you experienced pleasure from stimulation on the front wall of the vagina?',
      'Do certain angles during penetration create different or more intense internal sensations?',
      'Have you explored how internal and external stimulation might work together?',
    ],
    relatedConcepts: ['clitourethrovaginal', 'clitoral-structure', 'angling'],
    tier: 'free',
  },
];

// Helper to get concept by ID
export function getConceptById(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}

// Helper to get concepts by category
export function getConceptsByCategory(category: Concept['category']): Concept[] {
  return concepts.filter((c) => c.category === category);
}

// Helper to get concepts by tier
export function getConceptsByTier(tier: Concept['tier']): Concept[] {
  return concepts.filter((c) => c.tier === tier);
}

// Get all free concepts (for Phase 1)
export function getFreeConcepts(): Concept[] {
  return concepts.filter((c) => c.tier === 'free');
}
// Helper to get next concept for linear navigation
export function getNextConcept(currentId: string, pathwayId?: string): Concept | null {
  // 1. If a specific pathway is provided, follow that order
  if (pathwayId && pathwayId !== 'default') {
    const pathway = getPathwayById(pathwayId);

    if (pathway) {
      const currentIndex = pathway.conceptIds.indexOf(currentId);

      // If found and not the last item
      if (currentIndex !== -1 && currentIndex < pathway.conceptIds.length - 1) {
        const nextId = pathway.conceptIds[currentIndex + 1];
        return getConceptById(nextId) || null;
      }

      // If it's the last item in pathway, return null (end of pathway)
      if (currentIndex === pathway.conceptIds.length - 1) {
        return null;
      }
    }
  }

  // 2. Fallback: Default linear navigation or category-based
  const currentIndex = concepts.findIndex((c) => c.id === currentId);

  // If not found or last item, return null
  if (currentIndex === -1 || currentIndex === concepts.length - 1) {
    return null;
  }

  return concepts[currentIndex + 1];
}
