import { Component, computed, input, signal } from '@angular/core';
import { groupBy } from 'lodash-es';

import { MetricInput } from '../../shared/models/metric-input';
import { MetricScoreMeaning } from '../../shared/models/metric-score-meaning';
import { MetricScoreMeaningData } from '../../shared/models/metric-score-meaning-data';

@Component({
  selector: 'app-com-metric-score-summary',
  standalone: true,
  imports: [],
  templateUrl: './metric-score-summary.component.html',
  styleUrl: './metric-score-summary.component.scss',
})
export class MetricScoreSummaryComponent {
  height = input.required<string>();
  data = input.required<MetricInput[]>();

  zoneRank = signal<{ [key: string]: MetricScoreMeaning }>({
    LL: {
      val: 1,
      topic: 'ศักยภาพและความเต็มใจอยู่ในระดับที่ต้องการการพัฒนา',
      topicEn: '(LOW CAPACITY- LOW WILLINGNESS)',
      description: `แผนในหมวดนี้อาจแสดงให้เห็นถึงโอกาสในการพัฒนาทักษะและการมีส่วนร่วมในกิจกรรมระหว่างประเทศ

แนวทางการพัฒนา ควรสนับสนุนด้านการฝึกอบรมและการสร้างความตระหนักถึงความสำคัญของงานด้านต่างประเทศอาจช่วยยกระดับศักยภาพและความเต็มใจได้
`,
    },
    LM: {
      val: 2,
      topic: 'ศักยภาพปานกลาง - ความเต็มใจอยู่ในระดับที่ต้องการการพัฒนา',
      topicEn: '(MEDIUM CAPACITY- LOW WILLINGNESS)',
      description: `แผนมีทักษะและทรัพยากรบางส่วน แต่อาจต้องการการกระตุ้นแรงจูงใจเพิ่มเติม

แนวทางการพัฒนาจึงควรสร้างความเข้าใจถึงคุณค่าของงานด้านต่างประเทศและการปรับบทบาทให้สอดคล้องกับเป้าหมายส่วนบุคคลอาจช่วยเพิ่มความเต็มใจได้
`,
    },
    ML: {
      val: 3,
      topic: 'ศักยภาพอยู่ในระดับที่ต้องการการพัฒนา-ความเต็มใจปานกลาง',
      topicEn: '(LOW CAPACITY- MEDIUM WILLINGNESS)',
      description: `แผนมีความสนใจในงานด้านต่างประเทศ แต่อาจต้องการการพัฒนาทักษะหรือทรัพยากรเพิ่มเติม

แนวทางการพัฒนาจึงควรจัดหาโอกาสในการพัฒนาทักษะและการสนับสนุนทรัพยากรอย่างเหมาะสมจะช่วยเสริมสร้างศักยภาพให้สอดคล้องกับระดับความเต็มใจ
`,
    },
    LH: {
      val: 4,
      topic: 'ศักยภาพสูง - ความเต็มใจอยู่ในระดับที่ต้องการการพัฒนา',
      topicEn: '(HIGH CAPACITY- LOW WILLINGNESS)',
      description: `แผนมีทักษะและทรัพยากรที่ดี แต่อาจต้องการการกระตุ้นแรงจูงใจเพิ่มเติม

แนวทางการพัฒนาจึงควรปรับกิจกรรมให้สอดคล้องกับเป้าหมายส่วนบุคคลและการสร้างการรับรู้ถึงคุณค่าของงานด้านต่างประเทศซึ่งอาจช่วยเพิ่มความเต็มใจได้
`,
    },
    HL: {
      val: 5,
      topic: 'ศักยภาพอยู่ในระดับที่ต้องการการพัฒนา-ความเต็มใจสูง',
      topicEn: '(LOW CAPACITY- HIGH WILLINGNESS)',
      description: `แผนมีความกระตือรือร้นสูงในงานด้านต่างประเทศ แต่อาจต้องการการพัฒนาทักษะเพิ่มเติม 

แนวทางการพัฒนาจึงควรเน้นการฝึกอบรมเฉพาะทางและการสนับสนุนการพัฒนาทักษะเพื่อช่วยให้สามารถใช้ประโยชน์จากความเต็มใจที่เป็นอยู่อย่างเต็มที่
`,
    },
    MM: {
      val: 6,
      topic: 'ศักยภาพและความเต็มใจอยู่ในระดับปานกลาง',
      topicEn: '(MEDIUM CAPACITY- MEDIUM WILLINGNESS)',
      description: `แผนมีทักษะและความสนใจในระดับปานกลาง ซึ่งเพียงพอต่อการปฏิบัติงานทั่วไป 

แนวทางการพัฒนาจึงควรควบคู่ทั้งด้านทักษะและการสร้างแรงจูงใจอย่างสมดุลจะช่วยยกระดับประสิทธิภาพโดยรวม
`,
    },
    MH: {
      val: 7,
      topic: 'ศักยภาพสูง - ความเต็มใจปานกลาง',
      topicEn: '(HIGH CAPACITY- MEDIUM WILLINGNESS)',
      description: `แผนมีความพร้อมด้านทักษะและทรัพยากร พร้อมทั้งมีแรงจูงใจในระดับที่ดี
แนวทางการพัฒนาจึงควรเพิ่มแรงจูงใจและการใช้ประโยชน์จากความสามารถที่มีอยู่อย่างเต็มที่จะนำไปสู่ผลลัพธ์ที่โดดเด่นยิ่งขึ้น
`,
    },
    HM: {
      val: 8,
      topic: 'ศักยภาพปานกลาง - ความเต็มใจสูง',
      topicEn: '(MEDIUM CAPACITY- HIGH WILLINGNESS)',
      description: `แผนมีความกระตือรือร้นสูงและมีทักษะในระดับปานกลาง 
แนวทางการพัฒนาจึงควรเพิ่มเติมทักษะและการจัดสรรทรัพยากรอย่างเหมาะสมจะช่วยให้สามารถใช้ประโยชน์จากความเต็มใจที่มีอยู่ได้อย่างเต็มที่
`,
    },
    HH: {
      val: 9,
      topic: 'ศักยภาพและความเต็มใจสูง',
      topicEn: '(HIGH CAPACITY- HIGH WILLINGNESS)',
      description: `แผนมีทั้งความสามารถและความกระตือรือร้นในระดับสูงสำหรับกิจกรรมระดับนานาชาติ

ควรส่งเสริมให้เป็นต้นแบบและแบ่งปันประสบการณ์เพื่อสร้างแรงบันดาลใจให้กับแผนอื่นๆ ในองค์กร
`,
    },
  });

  genPlansText(groups: MetricInput[]) {
    return groups.map((g) => `${g.name} (${g.year})`).join(', ');
  }

  groupData = computed(() => {
    const items = groupBy(this.data(), (item) => {
      // x and y can be L M H so eg. LL LM MH HH
      let label: string = '';
      if (item.x > 6) {
        label += 'H';
      } else if (item.x > 3) {
        label += 'M';
      } else {
        label += 'L';
      }
      if (item.y > 6) {
        label += 'H';
      } else if (item.y > 3) {
        label += 'M';
      } else {
        label += 'L';
      }
      return label;
    });
    for (const [k, v] of Object.entries(items)) {
      v.sort((a: MetricInput, b: MetricInput) => {
        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        }
        if (a.year > b.year) {
          return -1;
        } else if (a.year < b.year) {
          return 1;
        }
        return 0;
      });
      items[k] = v;
    }
    const data: MetricScoreMeaningData[] = [];

    for (const [k, v] of Object.entries(this.zoneRank())) {
      if (items[k]) {
        const elem = new MetricScoreMeaningData();
        elem.list = items[k];
        elem.meaning = v;
        data.push(elem);
      }
    }
    console.log('==data', data);
    return data;
  });
}
