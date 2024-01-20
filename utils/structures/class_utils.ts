import { type classUtil } from '../types';
import chalk from 'chalk';

type FilePath = string;
type CsContent = string | Promise<string>;

class ClassUtils implements classUtil {
  public path: FilePath;
  public readonly content: CsContent;

  constructor(csPath: FilePath) {
    this.path = csPath;
    this.content = this.getContent();
  }

  public async getContent(): Promise<string> {
    try {
      const startTime: number = performance.now();
      const content: CsContent = await Bun.file(this.path).text();
      const elapsedTime: number = performance.now() - startTime;
      console.log(
        chalk.grey(
          `readDumpFile(${this.path}): ${chalk.blue(elapsedTime.toFixed(3))}ms`,
        ),
      );
      return content;
    } catch (error: any) {
      console.error('Error reading file:', error);
      return 'failed';
    }
  }

  public async findMethodType(offset: string): Promise<string | null> {
    try {
      const regexPattern: RegExp = new RegExp(
        `\/\/ RVA: (${offset}).*\n(.*)(EventHandler<[^>]+>|Action<[^>]+>|Tuple<[^>]+>|Comparison<[^>]+>|ConcurrentDictionary<[^>]+>|ObservableCollection<[^>]+>|Stack<[^>]+>|LinkedList<[^>]+>|KeyedCollection<[^>]+>|Lazy<[^>]+>|ConcurrentQueue<[^>]+>|ConcurrentStack<[^>]+>|ConcurrentBag<[^>]+>|ICollection<[^>]+>|List<[^>]+>|TupleList<[^>]+>|Task<[^>]+>|UniTask<[^>]+>|Nullable<[^>]+>|KeyValuePair<[^>]+>|HashSet<[^>]+>|Dictionary<[^>]+>|IEqualityComparer<[^>]+>|IEnumerable<[^>]+>|ValueTuple<[^>]+>|IReadOnlyList<[^>]+>|IList<[^>]+>|Queue<[^>]+>|Func<[^>]+>|ItemRarity|StorePromotionConfig|LobbyItemsBundle|CategoryNames|void|bool|byte|char|decimal|double|float|int|long|Vector3|object|string|ItemRarity|IEnumerator|LobbyItemsBundleIntPtr|UIntPtr|DBNull|EventHandler|EventArgs|Exception|EventHandler<TEventArgs>|Nullable|CancellationTokenSource|Random|Math|Console|DateTimeFormatInfo|Stopwatch|Guid.NewGuid\(\)|CultureInfo|File|DirectoryInfo|Stream|StreamReader|StreamWriter|StringBuilder|Regex|XmlDocument|XmlNode|XmlNodeList|XDocument|XElement|XAttribute|Uri|Version|Attribute|IDisposable|ICloneable|IEquatable|IComparable|IFormattable)+.*\\(`,
        'g',
      );

      const match: RegExpExecArray | null = regexPattern.exec(
        await this.content,
      );
      if (match && match[1] !== null) {
        const returnType: string = match[2] + match[3];
        return returnType.trim() || 'problems happened';
      } else {
        console.error('Offset match failed or result is null');
        return null;
      }
    } catch (error: any) {
      console.error('Error reading the file:', error);
      return null;
    }
  }
}

export { ClassUtils };
