import { Component } from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Label, Color } from "ng2-charts";
import { cards } from "./cards";
import { Creature, Card, Race, Keyword } from "src/card-types";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public barChartOptions: ChartOptions = {
    responsive: true
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [];
  public races: Race[] = [
    "Argonian",
    "Breton",
    "Dark Elf",
    "High Elf",
    "Imperial",
    "Khajiit",
    "Nord",
    "Orc",
    "Redguard",
    "Wood Elf"
  ];
  public emptyDictionary = () =>
    this.races.reduce(
      (prev, next) => ({
        ...prev,
        [next]: 0
      }),
      {}
    );
  public keywords: Keyword[] = [
    "Breakthrough",
    "Charge",
    "Drain",
    "Guard",
    "Lethal",
    "Prophecy",
    "Rally",
    "Regenerate",
    "Ward"
  ];
  public creatures: Creature[] = this.getCreatures()
    .filter(({ race: raceList }) =>
      raceList.some((race: Race) => this.races.includes(race))
    )
    .sort(({ race: race1 }, { race: race2 }) => {
      if (race1 < race2) {
        return -1;
      } else if (race1 > race2) {
        return 1;
      } else if (race1 === race2) {
        return 0;
      }
    });

  constructor() {
    this.keywords.forEach(keyword => {
      const counts = this.getCountsForCreatureTypeWithKeyword(keyword);
      console.log(keyword, counts);
      this.barChartData.push({
        data: Object.values(counts),
        label: `# of Cards With ${keyword}`
      });
    });
    this.barChartLabels.push(...this.races);
  }

  getCountsForCreatureTypeWithKeyword(
    keyword: Keyword
  ): { [key in Race]: number } {
    const _creatures = this.creatures.filter(({ keywords }) => keywords.includes(keyword))
    console.log(_creatures.length)
    return _creatures
    .reduce(
        (previous, { race: raceList }: Creature) => {
          raceList.forEach(race => {
            previous[race] = previous[race] + 1;
          })
          return previous;
        },
        this.emptyDictionary() as { [key in Race]: number }
      );
  }

  ngOnInit() {}

  getCreatures(): Creature[] {
    const creatures: Creature[] = [];
    cards.forEach(card =>
      card.type === "Creature" ? creatures.push(card) : (() => {})()
    );
    return creatures;
  }
}
