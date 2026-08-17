class Pet {
  final String starterPokemon;
  final String currentPokemon;
  final int stage;
  final int feedCount;
  final double fullness;
  final int? nextThreshold;
  final bool evolved;

  Pet({
    required this.starterPokemon,
    required this.currentPokemon,
    required this.stage,
    required this.feedCount,
    required this.fullness,
    this.nextThreshold,
    this.evolved = false,
  });

  factory Pet.fromJson(Map<String, dynamic> json) {
    return Pet(
      starterPokemon: json['starterPokemon'] ?? '',
      currentPokemon: json['currentPokemon'] ?? '',
      stage: json['stage'] ?? 1,
      feedCount: json['feedCount'] ?? 0,
      fullness: (json['fullness'] ?? 0).toDouble(),
      nextThreshold: json['nextThreshold'],
      evolved: json['evolved'] ?? false,
    );
  }
}
