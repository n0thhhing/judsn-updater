const OffsetPatterns: RegExp[] = [
  /\/\/ RVA: (0x4[0-9A-F]+).*\n\s+internal int \S+\(int \S+\).*\n\n\s+\/\/ RVA.*\n\s+internal float get_Health/, // clan parts
  /\/\/ RVA: (0x4[0-9A-F]+).*\n\s+public int \S+\(int \S+\).*\n\n.*\n\s+public int \S+.*\n\n.*\n\s+public void \.ctor/, // clan parts
  /\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal int get_Energy/, // clan energy
  /\/\/ RVA.*\n\s+internal void .ctor\(\S+ \S+\).*\n\n.*\n\s+internal void \.ctor\(string \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int/g, // free lottery
  /get_BaseCount.*\n\n\s+\/\/ RVA: (0x3[A-F0-9]+)/g, // lottery currence
  /\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int \S+.*\n\n\s+.*\n\s+private void \S+\(int \S+\).*\n\n.*\n\s+internal int \S+\(\)/g, // collectibles
  /\s+\/\/ RVA: 0x3[A-F0-9]+.*\n\s+public bool \S+\(Nullable<.*FreeSpin.*\n\n\s+\/\/ RVA: (0x3[A-F0-9]+)/g, // free chest count
  /(0x2[A-F0-9]+).*\n\s+internal static bool \S+ \S+.*\n\n.*\n.*\n.*\n.*\n.*\n\n.*\n\s+internal static void.*bool.*= True.*\n\n.*\n.*\n\n.*\n\s+internal static Offer/g, // gem clicker
  /internal int \S+\(\).*\n\n.*\n\s+internal int \S+\(\).*\n\n.*\n\s+internal void \S+\(int \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool \S+/g, // task clicker
  /internal void \.ctor\(Dictionary<string\, object> \S+.*\n\n.*\n\s+internal Dictionary<string, object> \S+\(\).*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool/g, // pixel clicker
  /\[CompilerGenerated\]\n\s+\/\/ RVA: 0x5.*\n\s+internal int \S+\(\).*\n\n\s+\[CompilerGenerated\]\n.*\n\s+private void \S+\(int \S+\).*\n\n\s+\/\/ RVA: (0x5[A-F0-9]+).*\n\s+internal bool/g, // black market clicker
  /\[CompilerGenerated\]\n.*\n\s+internal static void \S+\(Action<string> \S+.*\n\n\s+\/\/ RVA: 0x2.*\n\s+internal static GameOb.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // gadget unlocker
  /internal ModuleData\.ModuleType \S+\(\).*\n\n\s+\/\/ RVA: 0x2.*\n\s+internal ModuleData\.ModuleCategory \S+\(\).*\n\n.*\n\s+internal int.*\n\n.*\n\s+internal.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // module %
  /internal void \.ctor\(int \S+ ModuleData.ModuleRarity .*\n\n.*\n\s+internal bool.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // max modules
  /internal void .ctor\(int \S+ ModuleData.*\n\n.*\n.*\n\n.*\n.*\n\n.*\n.*\n\n.*\n.*\n\n\s+\/\/ RVA: (0x3[A-F0-9]+).*\n\s+internal bool/g, // max modules
  /internal ModuleData \S+\(\).*\n\n\s+\/\/ RVA: 0x2.*\n\s+internal ModuleData.ModuleType \S+\(\).*\n\n.*\n\s+internal ModuleData.ModuleCategory.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // max modules
  /internal int \S+\(\).*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int \S+\(int \S+\).*\n\n.*\n\s+internal int \S+\(int \S+\).*\n\n.*\n\s+internal bool \S+\(\).*\n\n.*\n\s+internal override string/g, // no parts modules
  /\s+internal static void \S+\(Action<float, bool> \S+.*\n\n\s+\/\/ RVA: 0x2.*\n\s+internal virtual string.*\n\n.*\n.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // no gadget cooldown
  /\s+internal static void \S+\(Action<float, bool> \S+.*\n\n\s+\/\/ RVA: 0x2.*\n\s+internal virtual string.*\n\n.*\n.*\n\n\s+\/\/ RVA: 0x[A-F0-9]+.*\n.*\n\n.*\/.*\n.*\n\n.*\n.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal virtual float/g, // no gadget cooldown
  /\s+internal static int\[.*\n\n\s+\[.*\]\n.*\n\s+internal static void.*\(Action.*\n\n\s+\[\S+\]\n.*\n\s+internal static void \S+\(Action.*\n\n.*\n\s+internal static void.*\n\n.*\n\s+internal static int.*\n\n\s+\/\/ RVA: 0x[A-F0-9]+.*\n.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+)/, // xp
  /public bool.*\n\n.*\n\s+public long \S+\(\).*\n\n\s+.*\n\s+public long \S+\(\).*\n\n\s+.*\n\s+public long \S+\(\).*\n\n\s+\/\/ RVA: (0x4[A-F0-9]+).*\n\s+public bool.*\n\n.*\n\s+public bool/g, // lobby bundles
  /internal static int \S+\(int.*\n\n\s+\/\/ RVA: 0x5[A-F0-9]+.*\n\s+internal static float \S+\(int.*\n\n.*\n\s+internal static int.*\n\n.*\n\s+internal static int.*\n\n.*\n\s+internal static float.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // fire rate
  /internal static bool \S+\(\).*\n\n.*\n\s+internal static float \S+\(\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static bool \S+\(\).*/g, // inf ammo
  /internal static SceneInfo \S+\(\S+ \S+\).*\n\n.*\n\s+internal static int.*bool.*\n\n.*\n.*\n\n.*\n.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // team kill
  /\s+\/\/ RVA: (0x1[A-F0-9]+).*\n\s+internal static bool \S+\(\).*\n\n.*\n\s+internal static bool \S+\(\).*\n\n.*\n\s+internal static bool \S+\(\).*\n\n.*\n\s+internal static bool \S+\(\).*\n\n.*\n\s+internal static bool \S+\(\).*\n\n.*\n\s+internal static bool \S+\(\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static void/g, // team kill
  /internal void \S+\(WeaponSounds\.\S+ \S+ = 0.*\n\n.*\n.*\n\n\s+\/\/ RVA: (0x4[A-F0-9]+)/g, // god
  /private void \S+\(ref float.*\n\n.*\n.*\n\n\s+\/\/ RVA: (0x4[A-F0-9]+)/g, // god
  /private void OnDestroy\(\).*\n\n\s+\/\/ RVA: (0x5[A-F0-9]+).*\n\s+private void OnTriggerEnter\(/g, // god
  /\/\/ RVA: (0x[A-F0-9]+).*\n\s+private void OnController.*\n\n.*\n\s+private void OnDestroy\(\).*\n\n\s+\/\/ RVA: 0x5[A-F0-9]+.*\n\s+private void OnTriggerEnter\(/g, // god
  /internal static void \S+\(int \S+\).*\n\n\s+\/\/ RVA: (0x3[A-F0-9]+).*\n\s+internal static int \S+\(\).*\n\n.*\n\s+internal static void \S+\(int \S+\).*\n\n.*\n\s+internal static int \S+\(\).*\n\n.*\n\s+internal static void \S+\(int \S+\).*\n\n.*\s+internal static int.*\n\n.*\n\s+public void \.ctor/g, // arena score
  /\/\/ RVA: (0x[A-F0-9]+).*\n\s+public int GetFreeCheckpointsCount\(\)/g, // free checkpoint count
  /\/\/ RVA: 0x[A-F0-9]+.*\s+internal virtual ItemRarity get_Rarity.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // rarity
  /\/\/ RVA: (0x[A-F0-9]+).*\s+internal virtual ItemRarity get_Rarity.*\n\n\s+\/\/ RVA: 0x[A-F0-9]+/g, //, rarity
  /\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int \S+\(\S+ \S+\).*\n\n.*\n\s+private void \S+\(Nullable/g, // rewards multiplier
  /\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static int \S+\(\).*\n\n.*\n\s+internal static \S+ \S+\(\S+ \S+, \S+ \S+\).*\n\n.*\s+internal static ValueTuple<.*>/g, // super chests
  /\[Extension\]\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static int \S+\(\S+ \S+, \S+ \S+ \S+ \S+\).*\n\n\s+\[/g, // clan chests
  /internal static \S+ \S+\(\S+ \S+\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static int \S+\(\S+ \S+\, \S+ \S+\).*\n\n.*\n\s+internal static int.*\n\n.*\n\s+internal static string/g, // clan chests
  /\[Extension\]\n\s+\/\/ RVA: 0x[A-F0-9]+.*\n\s+internal static int \S+\(\S+ \S+, \S+ \S+ \S+ \S+\).*\n\n\s+\[.*\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // clan super chest points
  /internal List<EggIncubatorProgress> \S+\(\).*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int/g, // egg rewards
  /internal Dictionary<string, int> \S+\(Egg.*\n\n.*(0x[A-F0-9]+)/g, // egg rewards
  /.*\n\s+internal bool \S+\(int [^A-F| ]+\).*\n\n.*(0x[A-F0-9]+).*\n\s+private bool/g, // give wear
  /internal int [^A-F| ]+\(int [^A-F| ]+.*\n\n.*\n\s+internal int \S+\(\S+ \S+\).*\n\n.*(0x[A-F0-9]+).*\n\s+internal int \S+\(int \S+\).*\n\n.*\n\s+internal int.*\n\n.*\n\s+internal int \S+\(int \S+\).*\n\n.*\n\s+internal int.*int.*\n\n.*\n\s+internal int.*int.*\n\n.*\n\s+internal/g, // give wear
  /internal static string \S+\(string \S+\).*\n\n\s+\/\/ RVA: (0x5[A-F0-9]+).*\n\s+private static bool \S+\(string \S+\).*\n\n.*\n\s+internal static bool \S+\(int/g, // campaign
  /internal static bool \S+\(\S+ \S+\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+private static void \S+\(int \S+\)/g, // guns
  /private static void \S+\(string \S+, int \S+ int\[\].*\b\b.*\n\n.*\n\s+private static void \S+\(object.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // guns
  /private static void \S+\(string \S+, int \S+ int\[\].*\b\b.*\n\n.*\n\s+private static void \S+\(object.*\n\n\s+\/\/ RVA: 0x[A-F0-9]+.*\n.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // royal
  /\s+\/\/ RVA: (0x3[A-F0-9]+).*\n\s+public static bool \S+\(CategoryNames \S+, ItemRecord \S+, bool/g, // royal
  /internal static void \S+\(\S+ \S+, CategoryNames \S+, FilterMaps \S+, ClanStoreTab \S+ = 0\).*\n\n.*\n\s+internal static List<ItemRecord>.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, //  wep skins
  /internal static void \S+\(string \S+, int \S+, bool \S+ = True, \S+ \S+\).*\n\n.*\n\s+internal static void .*string.*int.*bool.*= True.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // wep skins
  /internal static bool \S+CategoryNames \S+.*\n\n\s+\/\/ RVA: 0x3[A-F0-9]+.*\s+internal static bool \S+CategoryNames \S+.*\n\n.*\n\s+internal static bool \S+CategoryNames.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static bool \S+CategoryNames.*\n\n.*\n\s+internal static bool/g, // just armor
  /.*\n\s+internal static void \S+Action \S+\).*\n\n.*\n\s+internal static void \S+\(\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static int \S+\(\)/g, // custom level
  /internal \S+ \S+string itemId.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal bool/g, // deleted gadgets
  /\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static bool \S+ \S+\).*\n\n.*\n\s+private static bool \S+.*\n\n.*\n\s+internal void \S+string \S+, string \S+,/g, // deleted gadgets
  /internal \S+ \S+string itemId.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal bool/g, // hiden gadgets
  /(0x[A-F0-9]+).*\n\s+private bool.*\n\n\s+\/\/ RVA: 0x[A-F0-9]+.*\n\s+internal static bool \S+ \S+\).*\n\n.*\n\s+private static bool \S+.*\n\n.*\n\s+internal void \S+string \S+, string \S+,/g, // hidden gadgets
  /private static \S+<List<\S+>> .*\{ get; }\n\n.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // emperor
  /internal Nullable<DateTime> \S+ \S+.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal bool \S+ \S+.*\n\n.*\n\s+internal bool \S+ \S+, DateTime \S+/g, // inf 2x rew
  /internal bool .*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int \S+\(\).*\n\n.*\n\s+internal bool \S+\(\).*\n\n.*\n\s+internal bool.*\n\n.*\n\s+internal int \S+\(\).*\n\n.*\n\s+internal int .*\n\n.*\n\s+internal int/g, // max pass
  /internal int \S+\(\).*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool.*\n\n.*\n\s+internal int \S+.*\n\n.*\n\s+internal bool.*\n\n.*\n\s+internal bool/g, // premium pass
  /internal DateTime \S+\(\).*\n\n.*\n\s+internal int \S+\(\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal DateTime \S+\(\).*\n\n.*\n\s+internal int.*\n\n.*\n\s+internal int/g, // reset pass
  /\/\/ RVA: (0x[A-F0-9]+).*\n\s+private long.*\n\n.*\n\s+private int.*\n\n.*\n\s+private void/g, // pet egg cd
  /internal GameObject\[\].*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static int/g, // mobs per wave
  /internal static GameObject \S+string \S+\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static bool/g, // clan gadgets
  /internal bool \S+\(\S+ x\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal bool \S+KeyValuePair<string, \S+> kvp\).*\n\n.*\n\s+internal bool \S+KeyValuePair<string/g, // unreleased royal
  /internal static void \S+\(string \S+, int \S+, bool \S+ = True, \S+ \S+\).*\n\n.*\n\s+internal static void .*string.*int.*bool.*= True.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // wear parts
  /internal static bool \S+CategoryNames \S+.*\n\n\s+\/\/ RVA: 0x3[A-F0-9]+.*\s+internal static bool \S+CategoryNames \S+.*\n\n.*\n\s+internal static bool \S+CategoryNames.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static bool \S+CategoryNames.*\n\n.*\n\s+internal static bool/g, // wear true
  /0x.*\n\s+internal string \S+\(\).*\n\n.*0x.*\n\s+internal string \S+\(\).*\n\n.*0x.*\n\s+internal string \S+\(\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal bool.*\n\n.*\n\s+internal bool.*\n\n.*\n\s+internal int/g, // gift pass
  /internal string \S+\(\).*\n\n.*\n\s+internal bool \S+\(\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal bool .*\n\n.*\n\s+internal int/g, // gift pass
  /\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal bool.*\n\n.*\n\s+internal StorePromotionConfig \S+\(\).*\n\n.*\n\s+internal void .ctor/g, // gift pass
  /internal void \S+List<WeaponSounds\.\S+\> \S+.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal bool \S+\(\).*\n\n/g, // clan wear
  /\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal bool \S+\(\).*\n\n.*\n\s+internal int.*\n\n.*\n\s+internal int \S+\(\).*\n\n.*\n\s+internal int \S+\(\).*\n\n.*\n\s+private void \.ctor/g, // collectibles v2
  /internal static bool \S+CategoryNames \S+.*\n\n\s+\/\/ RVA: 0x3[A-F0-9]+.*\s+internal static bool \S+CategoryNames \S+.*\n\n.*\n\s+internal static bool \S+CategoryNames.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static bool \S+CategoryNames.*\n\n.*\n\s+internal static bool/g, // unreleased royal
  /public void \.ctor\(\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal bool \S+\(ItemRecord x\).*\n\n.*\n\s+internal bool \S+\(\S+ x.*\n\n.*\n\s+internal bool/g, // unrelleased royal
  /internal void .ctor\(int \S+ string \S+\).*\n\n.*\n\s+internal void \.ctor.*\n\n.*\n\s+internal void .ctor\(string \S+\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, //armory price
];

const FieldPatterns: RegExp[] = [
  /public bool railgun; \/\/ (0x\S+)/g, // railgun
  /public bool railgunStopAtWall; \/\/ (0x\S+)/g, // railgun
  /public bool isDash; \/\/ (0x\S+)/g, // dash
  /public float dashDecaySpeed; \/\/ (0x\S+)/g, // dash
  /public float chargeTime; \/\/ (0x\S+)/g, // charge
  /public bool bulletExplode; \/\/ (0x\S+)/g, // explode
  /private float recoilCoeff; \/\/ (0x\S+)/g, // recoil
  /public bool ignoreBarrier; \/\/ (0x\S+)/g, // reflect
  /public bool ignoreSlyWolf; \/\/ (0x\S+)/g, // reflect
  /public bool ignoreReflector; \/\/ (0x\S+)/g, // reflect
  /public bool isShotGun; \/\/ (0x\S+)/g, // shotgun
  /public bool isMeleeGravitationForce; \/\/ (0x\S+)/g, // range
  /public bool bazooka; \/\/ (0x\S+)/g, // bazooka
  /public bool grenadeLauncher; \/\/ (0x\S+)/g, // grenade
  /public bool fanRocketShoot; \/\/ (0x\S+)/g, // fan
  /public bool isGhost; \/\/ (0x\S+)/g, // ghost
  /public bool isFrostSword; \/\/ (0x\S+)/g, // kill all
  /public float frostDamageMultiplier; \/\/ (0x\S+)/g, // kill all
  /public float frostRadius; \/\/ (0x\S+)/g, // kill all
  /public bool isRoundMelee; \/\/ (0x\S+)/g, // round melee
  /public bool useAngleForRoundMelee; \/\/ (0x\S+)/g, // round melee
  /public float radiusRoundMelee; \/\/ (0x\S+)/g, // round melee
  /public float invisibleAfterRespawnTime; \/\/ (0x\S+)/g, // inf score
  /public bool buffPointsRevengeDesigner; \/\/ (0x\S+)/g, // inf score
  /public int criticalHitChance; \/\/ (0x\S+)/g, // critical
  /public bool isInvisibleAfterKill; \/\/ (0x\S+)/g, // invisible
  /public bool invisWhenCharged; \/\/ (0x\S+)/g, // invisible
  /public float frostSwordnTime; \/\/ (0x\S+)/g, // invisible
  /public bool isInvisibleAfterKill; \/\/ (0x\S+)/g, // invisible
  /public bool isInvisibleReload; \/\/ (0x\S+)/g, // invisible
  /public float invisibleAfterKillTime; \/\/ (0x\S+)/g, // invisible
  /public bool isFastAfterKill; \/\/ (0x\S+)/g, // fast
  /public float timeFastAfterKill; \/\/ (0x\S+)/g, // fast
  /public float fastMultiplier; \/\/ (0x\S+)/g, // fast
  /public float shotgunOverDamageCoef; \/\/ (0x\S+)/g, // dmg
  /public bool isSectorsAOE; \/\/ (0x\S+)/g, // dmg
  /public float sectorsAOEAngleFront; \/\/ (0x\S+)/g, // dmg
  /public float sectorsAOEAngleBack; \/\/ (0x\S+)/g, // dmg
  /public float sectorsAOEDamageMultiplierFront; \/\/ (0x\S+)/g, // dmg
  /public bool isDamageReflection; \/\/ (0x\S+)/g, // godm
  /public bool isDamageHeal; \/\/ (0x\S+)/g, // godm
  /public bool isDamageAndArmorHeal; \/\/ (0x\S+)/g, // godm
  /public float damageHealMultiplier; \/\/ (0x\S+)/g, // godm
  /public bool isArmorRegeneration; \/\/ (0x\S+)/g, // godm
  /public float armorRegenerationPercent; \/\/ (0x\S+)/g, // godm
  /public float armorRegenerationTime; \/\/ (0x\S+)/g, // godm
  /public bool healer; \/\/ (0x\S+)/g, // godm
  /internal bool healingArea; \/\/ (0x\S+)/g, // godm
  /internal bool healingHimSelf; \/\/ (0x\S+)/g, // godm
  /internal float radiusHealing; \/\/ (0x\S+)/g, // godm
  /public bool isCoinDrop; \/\/ (0x\S+)/g, // coin
  /public float coinDropChance; \/\/ (0x\S+)/g, // coin
  /public bool enemyMarker; \/\/ (0x\S+)/g, // ray
  /public bool enemyMarkerWhenAiming; \/\/ (0x\S+)/g, // ray
  /public bool enemyMarkerWhenShot; \/\/ (0x\S+)/g, // ray
  /public int enemyMarkId; \/\/ (0x\S+)/g, // ray
  /public bool zoomXray; \/\/ (0x\S+)/g, // ray
  /public bool isZooming; \/\/ (0x\S+)/g, // ray
  /public bool isDoubleJump; \/\/ (0x\S+)/g, // double jump
  /public bool polymorpher; \/\/ (0x\S+)/g, // poly
  /public float polymorphDuarationTime; \/\/ (0x\S+)/g, // poly
  /public float sectorsAOERadiusSectorsAoE; \/\/ (0x\S+)/g, // poly???
  /public float polymorphMaxHealth; \/\/ (0x\S+)/g, // poly
  /public bool harpoon; \/\/ (0x\S+)/g, // poly???
  /public float harpoonMaxDistance; \/\/ (0x\S+)/g, // poly
  /public float harpoonDecaySpeed; \/\/ (0x\S+)/g, // poly
  /public bool isHeadMagnifier; \/\/ (0x\S+)/g, // big head
  /public float headMagnifierTime; \/\/ (0x\S+)/g, // big head
  /public bool isPoisoning; \/\/ (0x\S+)/g, // poison
  /public float poisonDamageMultiplier; \/\/ (0x\S+)/g, // poison
  /private float poisonTime; \/\/ (0x\S+)/g, // poison
  /public bool isBlindEffect; \/\/ (0x\S+)/g, // blind
  /public float isBlindEffectTime; \/\/ (0x\S+)/g, // blind
  /public bool fireImmunity; \/\/ (0x\S+)/g, // effect immunity
  /public bool bleedingImmunity; \/\/ (0x\S+)/g, // effect immunity
  /public bool toxicImmunity; \/\/ (0x\S+)/g, // effect immunity
  /public bool isKilledTargetExplode; \/\/ (0x\S+)/g, // explode die
  /public float killedTargetExplosionDamageMultiplier; \/\/ (0x\S+)/g, // explode die
  /public float killedTargetExplosionRadiusDamage; \/\/ (0x\S+)/g, // explode die
  /public float killedTargetExplosionRadiusDamageSelf; \/\/ (0x\S+)/g, // explode die
  /public bool isCharm; \/\/ (0x\S+)/g, // charm
  /public float charmTime; \/\/ (0x\S+)/g, // charm
  /public bool isWeaknessEffect; \/\/ (0x\S+)/g, // weak
  /public float weaknessEffectTime; \/\/ (0x\S+)/g, // weak
  /public bool isElectricShock; \/\/ (0x\S+)/g, // shock
  /public float electricShockCoeff; \/\/ (0x\S+)/g, // shock
  /public float electricShockTime; \/\/ (0x\S+)/g, // shock
  /public bool isSlowdown; \/\/ (0x\S+)/g, // slow
  /public float slowdownCoeff; \/\/ (0x\S+)/g, // slow
  /public float slowdownTime; \/\/ (0x\S+)/g, // slow
  /public bool isSlowdownStack; \/\/ (0x\S+)/g, // slow
  /public bool isCursing; \/\/ (0x\S+)/g, // curse
  /public float curseTime; \/\/ (0x\S+)/g, // curse
  /public float curseDamageMultiplier; \/\/ (0x\S+)/g, // curse
  /public bool jumpDisabler; \/\/ (0x\S+)/g, // disable jump
  /public float jumpDisableTime; \/\/ (0x\S+)/g, // disable jump
  /public bool isGadgetDisabler; \/\/ (0x\S+)/g, // gadget
  /public float gadgetDisableTime; \/\/ (0x\S+)/g, // gadget
];

const SignitureRegex: RegExp[] = [
  //g
];

export { OffsetPatterns, FieldPatterns, SignitureRegex };
