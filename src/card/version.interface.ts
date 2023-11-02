export class Version {
  constructor(
    readonly major: number = 0,
    readonly minor: number = 0,
    readonly patch: number = 0) { }

  public bump = () => new Bump(this);

  public toString(): string {
    return this.major + '.' + this.minor + '.' + this.patch;
  }

  public static fromString(s: string): Version {
    const split = s.split('.');
    return new Version(parseInt(split[0]), parseInt(split[1]), parseInt(split[2]));
  }
}

class Bump {
  constructor(private readonly version: Version) { }

  public major(): Version {
    return new Version(this.version.major + 1);
  }

  public minor(): Version {
    return new Version(this.version.major, this.version.minor + 1);
  }

  public patch(): Version {
    return new Version(this.version.major, this.version.minor, this.version.patch + 1);
  }
}
