import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '../components/ui/typography';

const meta = {
  title: 'ui/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ArticleExample: Story = {
  render: () => (
    <article>
      {/* Main Title */}
      <Typography variant="h1">The Joke Tax Chronicles</Typography>

      {/* Introduction Paragraph */}
      <Typography variant="p">
        Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One
        day, his advisors came to him with a problem: the kingdom was running out of money.
      </Typography>

      {/* Heading 2 */}
      <Typography variant="h2">The King&#39;s Plan</Typography>

      {/* Paragraph */}
      <Typography variant="p">
        The king thought long and hard, and finally came up with a brilliant plan: he would tax the jokes in the
        kingdom.
      </Typography>

      {/* Blockquote for emphasis */}
      <Typography variant="blockquote">
        &quot;After all,&quot; he said, &quot;everyone enjoys a good joke, so it&#39;s only fair that they should pay
        for the privilege.&quot;
      </Typography>

      {/* Heading 3 */}
      <Typography variant="h3">The Joke Tax</Typography>

      {/* Paragraph */}
      <Typography variant="p">
        The king&#39;s subjects were not amused. They grumbled and complained, but the king was firm:
      </Typography>

      {/* Ordered list for the joke tax levels */}
      <Typography variant="ol">
        <li>1st level of puns: 5 gold coins</li>
        <li>2nd level of jokes: 10 gold coins</li>
        <li>3rd level of one-liners: 20 gold coins</li>
      </Typography>

      {/* Paragraph */}
      <Typography variant="p">
        As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there was one person who
        refused to let the king&#39;s foolishness get him down: a court jester named Jokester.
      </Typography>

      {/* Heading 3 */}
      <Typography variant="h3">Jokester&#39;s Revolt</Typography>

      {/* Paragraph */}
      <Typography variant="p">
        Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under
        the king&#39;s pillow, in his soup, even in the royal toilet. The king was furious, but he couldn&#39;t seem to
        stop Jokester.
      </Typography>

      {/* Paragraph */}
      <Typography variant="p">
        And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they
        couldn&#39;t help but laugh. And once they started laughing, they couldn&#39;t stop.
      </Typography>

      {/* Heading 2 */}
      <Typography variant="h2">The People&#39;s Rebellion</Typography>

      {/* Paragraph */}
      <Typography variant="p">
        The people of the kingdom, feeling uplifted by the laughter, started to tell jokes and puns again, and soon the
        entire kingdom was in on the joke.
      </Typography>

      {/* Paragraph */}
      <Typography variant="p">
        The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
        Jokester was declared a hero, and the kingdom lived happily ever after.
      </Typography>

      {/* Closing with a moral using a tagline or mutedText variant */}
      <Typography variant="blockquote" className="mt-6">
        The moral of the story is: never underestimate the power of a good laugh and always be careful of bad ideas.
      </Typography>
    </article>
  ),
};
