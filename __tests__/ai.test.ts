/* eslint-disable quotes */
import { parseTitleAndCaption } from "@/photo/ai";

describe('AI text parses', () => {
  it('titles and captions', () => {
    // Complex case
    expect(parseTitleAndCaption(
      `'Title: "Ephemeral Beauty" Caption: "Roses bask in fleeting sunlight."'`
    )).toStrictEqual({
      title: 'Ephemeral Beauty',
      caption: 'Roses bask in fleeting sunlight',
    });
    // Without surrounding single quotes
    expect(parseTitleAndCaption(
      `Title: "Ephemeral Beauty"  Caption: "Roses bask in fleeting sunlight."`
    )).toStrictEqual({
      title: 'Ephemeral Beauty',
      caption: 'Roses bask in fleeting sunlight',
    });
    // Without trailing period
    expect(parseTitleAndCaption(
      `Title: "Ephemeral Beauty"  Caption: "Roses bask in fleeting sunlight"`
    )).toStrictEqual({
      title: 'Ephemeral Beauty',
      caption: 'Roses bask in fleeting sunlight',
    });
    // Without and quotes
    expect(parseTitleAndCaption(
      `Title: Ephemeral Beauty  Caption: Roses bask in fleeting sunlight`
    )).toStrictEqual({
      title: 'Ephemeral Beauty',
      caption: 'Roses bask in fleeting sunlight',
    });
    // With single space
    expect(parseTitleAndCaption(
      `Title: Ephemeral Beauty Caption: Roses bask in fleeting sunlight`
    )).toStrictEqual({
      title: 'Ephemeral Beauty',
      caption: 'Roses bask in fleeting sunlight',
    });
  });
});
